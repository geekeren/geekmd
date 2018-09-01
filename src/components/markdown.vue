<template>
  <div id="markdown" class='markdown-container'>
    <header>
      <span class='title menu_item'>极客MD编辑器</span>
      <div class='menu_group right'>
        <button class='menu_item' ref='button'>复制</button>
        <button class='menu_item'
                v-bind:class="{active: viewState.length === 1 && viewState[0] === 'edit'}"
                @click="viewState = ['edit']">仅编辑</button>
        <button class='menu_item'
                v-bind:class="{active: viewState.length === 1 && viewState[0] === 'preview'}"
                @click="viewState = ['preview']">仅预览</button>
        <button class='menu_item'
                v-bind:class="{active: viewState.indexOf('edit') >= 0 && viewState.indexOf('preview') >= 0}"
                @click="viewState = ['edit', 'preview']">编辑|预览</button>
      </div>
    </header>
    <div class='markdown-input-section section' v-if="viewState.indexOf('edit') >= 0">
      <div class='subject-input'
           v-if='showSubjectInput'>
        <!--<label for="emailSubject">邮件主题</label>-->
        <textarea
            id='emailSubject'
            type='text'
            v-model='rawEmailSubjectInput'
            placeholder="请输入邮件主题">
        </textarea>
      </div>
      <textarea
          autocomplete='off'
          ref='inputTextArea'
          class='edit-text-area content'
          @scroll="onInputScroll"
          v-model='rawInputMd'>
      </textarea>
    </div>
    <div class='html-preview-section section' v-if="viewState.indexOf('preview') >= 0">
      <div class='html-preview-content content'
           ref='parsedHtmlNode'>
        <div class="mail-container">
          <div class='content-container'>
            <div class="content-header">
              <img style="width: 100%" src="../assets/header.png"/>
              <div class="title" v-html="emailSubject() || '<空主题>'">
              </div>
            </div>
            <div class="content-body" v-html='parsedHtml()'>
            </div>
            <div class="content-footer">
            </div>
          </div>
          <div class='copyright-info'>
            本邮件自豪地采用“<a href='https://md.wangbaiyuan.cn'>极客MD</a>”编辑并排版
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
  import {Component, Vue} from 'vue-property-decorator';
  import Clipboard from 'clipboard';
  import debounce from 'debounce';
  import markdown from './markdown';
  import EditHelper from '../utils/edit-helper';
  import MdImage from '../models/Image';

  @Component
  export default class Markdown extends Vue {
    public viewState: string[] = ['edit','preview'];
    public rawInputMd: string = '';
    public rawEmailSubjectInput: string = '极客MD编辑器\n用Markdown写邮件';
    public editHelper: EditHelper | null = null;
    public imageStorage: MdImage[] = [];
    public showSubjectInput: boolean = true;

    private mounted() {
      this.editHelper = new EditHelper(this.$refs.inputTextArea as HTMLTextAreaElement);
      this.loadDefaultContent();
      this.registerEvents();
    }

    private loadDefaultContent() {
      try {
        this.imageStorage = JSON.parse(localStorage.getItem('md.images') || '[]') as MdImage[];
      } catch (e) {
        this.imageStorage = [];
      }
      if (this.imageStorage && this.imageStorage.constructor === Array && this.imageStorage.length > 0) {
        this.imageStorage.forEach((image: MdImage) => {
          markdown.image_add(`${image.id}`, image.data);
        });
      } else {
        this.imageStorage = [];
      }
      const subject: string | null = localStorage.getItem('md.emailSubjectInput');
      if(subject) {
        this.rawEmailSubjectInput = subject;
      }
      const content: string | null = localStorage.getItem('md.content');
      if (!content) {
        this.$http.get('/data/example.md')
          .then((data: any) => {
            this.rawInputMd = data.body;
          });
      } else {
        this.rawInputMd = content;
      }
    }

    private registerEvents() {
      const md = this;
      this.$watch('rawEmailSubjectInput', (newValue: string) => {
        debounce(() => localStorage.setItem('md.emailSubjectInput', newValue), 500)();
      });
      this.$watch('rawInputMd', (newValue: string) => {
        if (!newValue) {
          md.imageStorage = [];
        }
        debounce(() => localStorage.setItem('md.content', newValue), 1000)();

      });
      this.$watch('imageStorage', (newValue: string) => {
        debounce(() => localStorage.setItem('md.images', JSON.stringify(newValue)), 1000)();
      });
      const parsedHtmlNode: Element = this.$refs.parsedHtmlNode as Element;
      const copyBtn: Element = this.$refs.button as Element;
      const clipboard = new Clipboard( copyBtn, {
        target: () => parsedHtmlNode,
      });
      clipboard.on('success', this.onCopy);
      clipboard.on('error', this.onError);

      const inputTextArea: HTMLTextAreaElement = this.$refs.inputTextArea as HTMLTextAreaElement;
      inputTextArea.addEventListener('paste', (e: ClipboardEvent) => {
        const clipboardData = e.clipboardData;
        if (clipboardData) {
          const items = clipboardData.items;
          if (!items) {
            return;
          }
          const types = clipboardData.types || [];
          let item = null;
          for (let i = 0; i < types.length; i++) {
            if (types[i] === 'Files') {
              item = items[i];
              break;
            }
          }
          if (item && item.kind === 'file') {
            e.preventDefault();
            e.stopPropagation();
            const oFile = item.getAsFile();
            const imageReader = new FileReader();
            imageReader.onload = () => {
              if (imageReader) {
                const result = imageReader.result!.toString() || '';
                const image = new MdImage({
                  id: 0,
                  alt: '图片描述',
                  data: result,
                });
                this.addImage(image);
                this.editHelper!
                  .insertTextAtCursor(`\n![${image.alt}](${image.id})\n\n` || '')
                  .then((output: string) => this.rawInputMd = output);
              }
            };
            if (oFile) {
              imageReader.readAsDataURL(oFile);
            }
          }
        }
      });
    }

    private addImage(image: MdImage) {
      image.id = `./images/${new Date().getTime()+ '_' + this.imageStorage.length + 1}.pic`;
      this.imageStorage.push(image);
      markdown.image_add(`${image.id}`, image.data);
    }

    private emailSubject() {
      if (this.rawEmailSubjectInput) {
        const titles: string[] = this.rawEmailSubjectInput.split('\n');
        return `<div class="sub-title">${titles[0]}</div>${titles[1] || ''}`;
      }
      return '< 空主题 >';
    }
    private parsedHtml() {
      if (this.rawInputMd) {
        const mdToParsed = this.parseRawMd(this.rawInputMd);
        return markdown.render(mdToParsed);
      }
      return '内容为空';
    }

    private onInputScroll(e: Event) {
      this.showSubjectInput = (e.target as HTMLElement).scrollTop > 10 ? false : true;
      if (e.srcElement) {
        this.editHelper!.syncElementScrolling(e.srcElement as HTMLElement, this.$refs.parsedHtmlNode);
      }
    }

    private onCopy(e: any) {
      alert('复制成功!');
    }

    private onError(e: any) {
      alert('复制失败');
    }

    private parseRawMd(rawMd: string) {
      return rawMd.replace('\n', '\r\n\n');
    }
  }
</script>
<style lang='scss'>

  .markdown-container {
    width: 100%;
    height: 100%;
    flex: 2;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    background: #eee;
    header {
      width: 100%;
      padding: 0.6em 30px;
      position: absolute;
      z-index: 1000;
    }
    .section {
      position: relative;
      text-align: left;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      overflow-y: auto;
      margin: 0px;
      /*-webkit-border-radius: 2px;*/
      /*border-radius: 2px;*/
    }
    .content-container {
      min-height: 100%;
      margin-top: 3em;
    }
    .content {
      padding: 6.5em 1em 10em 1em;
      flex: 1;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
    .edit-text-area {
      -webkit-appearance: none;
      -moz-appearance: none;
      background-color: transparent;
      border: none;
      resize: none;
      font-size: 1em;
      line-height: 1.5em;
      box-shadow: none;
      box-sizing: inherit;
      color: #cde6f5;
      width: 100%;
      outline: solid #20d6ff 1px;
      padding-top: 7em;
    }
    .markdown-input-section {
      background: #333;
      max-width: 840px;
      margin: 0 auto;
      header {
        .title {
          color: #20d6ff;
        }
      }
      .subject-input {
        font-size: 16px;
        top: 40px;
        position: absolute;
        width: 100%;
        color: white;
        border-bottom: dashed #ddd 1px;
        textarea {
          color: white;
          background: #00000000;
          border: none;
          outline: none;
          font-size: 1em;
          font-weight: bold;
          width: 100%;
          text-align: center;
          resize: none;
        }
      }
    }
    .menu_group {
      display: inline;
      text-align: right;
      .menu_item {
        cursor: pointer;
        user-select: none;
        border: solid 1px #e6f1ff;
        outline: none;
        margin: 0 3px;
        background: #7ba9c3;
        color: white;
        padding: 6px 12px;
        border-radius: 3px;
        font-size: 1em;
      }
      .active {
        background: #1e6bb8;
      }
    }

    .right {
      float: right;
    }
    .html-preview-section {
      background: #fff;
      .html-preview-content {
        padding-top: 3.5em;
      }
      .copyright-info {
        display: none;
      }
    }
    .mail-container {
      min-height: 100vh;
      .content-container {
        background: #ffffff;
        max-width: 840px;
        width: 100%;
        min-height: calc(100vh - 60px);
        margin: 0 auto;
        box-shadow: 3px 5px 20px #b8dcec;
        border: 0.5px solid #d8e7f3;
        .content-header {
          width: 100%;
          min-height: 150px;
          position: relative;
          display: inline-flex;
          align-items: center;
          img {
            top: 0;
            height: 100%;
            width: 100%;
            position: absolute;
          }
          .title {
            width: 100%;
            position: absolute;
            text-align: center;
            color: #022d48;
            padding: 30px 10px 10px 10px;;
            word-wrap: break-word;
            word-break: normal;
            font-size: 0.9em;
            .sub-title {
              font-size: 2em;
              line-height: 1.2em;
              font-weight: bold;
            }
          }
        }
        .content-body {
          padding: 3.5em 2em;
          h1, h2, h3, h4, h5 {
            color: #125da1;
            margin-bottom: 1em;
          }
          li {
            font-weight: 450;
          }
        }

      }
      .copyright-info {
        display: block;
        max-width: 860px;
        margin: 0 auto;
        padding: 12px;
        font-size: 12px;
        text-align: right;
        font-style: italic;
      }
    }
  }

</style>
