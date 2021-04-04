/*
Model Class for Exception Details
*/

class ExceptionDetails {
  constructor(errorMessage, stackTrace) {
    this.errorMessage = errorMessage;
    if (stackTrace.length > 2000) {
      this.stackTrace = stackTrace.substring(0, 2000);
    } else {
      this.stackTrace = stackTrace;
    }
  }
}

export default ExceptionDetails;