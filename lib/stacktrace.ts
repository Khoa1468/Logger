export interface StackFrame extends NodeJS.CallSite {
  getFunctionName(): string;
  getMethodName(): string;
  getTypeName(): string;
}

export function get(belowFn?: () => void): StackFrame[] {
  const oldLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;

  const dummyObject = {
    stack: null,
  };

  const v8Handler = Error.prepareStackTrace;
  Error.prepareStackTrace = function (dummyObject, v8StackTrace) {
    return v8StackTrace;
  };
  Error.captureStackTrace(dummyObject, belowFn || get);

  const v8StackTrace: StackFrame[] | null = dummyObject.stack;
  Error.prepareStackTrace = v8Handler;
  Error.stackTraceLimit = oldLimit;

  return v8StackTrace!;
}

export function parse(err: Error): StackFrame[] {
  if (!err.stack) {
    return [];
  }

  const lines = err.stack.split("\n").slice(1);
  return lines
    .map(function (line): StackFrame {
      if (line.match(/^\s*[-]{4,}$/)) {
        return {
          getThis: () => null,
          getTypeName: () => null!,
          getFunction: () => null!,
          getFunctionName: () => null!,
          getMethodName: () => null!,
          getFileName: () => line,
          getLineNumber: () => null,
          getColumnNumber: () => null,
          isNative: () => null!,
          getEvalOrigin: () => null!,
          isEval: () => null!,
          isConstructor: () => null!,
          isToplevel: () => null!,
        };
      }

      const lineMatch = line.match(
        /at (?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/
      );
      if (!lineMatch) {
        return {
          getThis: () => null,
          getTypeName: () => null!,
          getFunction: () => null!,
          getFunctionName: () => null!,
          getMethodName: () => null!,
          getFileName: () => null,
          getLineNumber: () => null,
          getColumnNumber: () => null,
          isNative: () => null!,
          getEvalOrigin: () => null!,
          isEval: () => null!,
          isConstructor: () => null!,
          isToplevel: () => null!,
        };
      }

      let object = null;
      let method = null;
      let functionName: string | null = null;
      let typeName: string | null = null;
      let methodName: string | null = null;
      let isNative = lineMatch[5] === "native";
      let isConstructor = false;

      if (lineMatch[1]) {
        functionName = lineMatch[1];
        let methodStart = functionName.lastIndexOf(".");
        if (functionName[methodStart - 1] == ".") methodStart--;
        if (methodStart > 0) {
          object = functionName.substr(0, methodStart);
          method = functionName.substr(methodStart + 1);
          const objectEnd = object.indexOf(".Module");
          if (objectEnd > 0) {
            functionName = functionName.substr(objectEnd + 1);
            object = object.substr(0, objectEnd);
          }
        }
      }

      if (method) {
        typeName = object;
        methodName = method;
      }

      if (method === "<anonymous>") {
        methodName = null;
        functionName = null;
      }

      if (functionName?.startsWith("new ")) {
        isConstructor = true;
        typeName = object;
      }

      const properties: StackFrame = {
        getTypeName: () => typeName!,
        getFileName: () => lineMatch[2] || null,
        getLineNumber: () => parseInt(lineMatch[3], 10) || null,
        getColumnNumber: () => parseInt(lineMatch[4], 10) || null,
        getFunctionName: () => functionName!,
        getMethodName: () => methodName!,
        isNative: () => isNative,
        isEval: () => null!,
        isConstructor: () => isConstructor,
        isToplevel: () => null!,
        getFunction: () => null!,
        getEvalOrigin: () => null!,
        getThis: () => null,
      };

      return properties;
    })
    .filter(function (callSite) {
      return !!callSite;
    });
}
