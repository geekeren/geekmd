export default class EditHelper {
  constructor(textArea) {
    this.inputTextArea = textArea;
  }

  insertTextAtCursor(text) {
    this.inputTextArea.focus();
    return new Promise((resolve) => {
      const isSuccess = document.execCommand('insertText', false, text);
      if (!isSuccess && typeof this.inputTextArea.setRangeText === 'function') {
        const start = this.inputTextArea.selectionStart;
        this.inputTextArea.setRangeText(text);
        this.inputTextArea.selectionStart = start + text.length;
        this.inputTextArea.selectionEnd = start + text.length;
        const e = document.createEvent('UIEvent');
        e.initEvent('input', true, false);
        this.inputTextArea.dispatchEvent(e);
      }
      resolve(this.inputTextArea.value);
      this.inputTextArea.focus();
    });
  }

  static syncElementScrolling(e1, e2) {
    const element = e2;
    element.scrollTop = (e1.scrollTop + e1.offsetHeight) / (e1.scrollHeight)
      * e2.scrollHeight - e2.offsetHeight;
    element.scrollTop *= e1.scrollTop / (e1.scrollHeight - e1.offsetHeight);
  }
}
