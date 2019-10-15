<template>
  <div id="markdown" class='markdown-container'>
    <header>
      <div class='menu_group right'>
        <button class='menu_item' @click="reset">重置</button>
        <button class='menu_item' ref='button'>复制</button>
        <button class='menu_item'
                :class="{active: viewState.length === 1 && viewState[0] === 'edit'}"
                @click="viewState = ['edit']">仅编辑
        </button>
        <button class='menu_item'
                :class="{active: viewState.length === 1 && viewState[0] === 'preview'}"
                @click="viewState = ['preview']">仅预览
        </button>
        <button class='menu_item'
                :class="{
                  active: viewState.indexOf('edit') >= 0 && viewState.indexOf('preview') >= 0
                }"
                @click="viewState = ['edit', 'preview']">编辑|预览
        </button>
      </div>
    </header>
    <div class='markdown-input-section section'
         v-if="viewState.indexOf('edit') >= 0">
      <div class='markdown-input-container'>
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
    </div>
    <Preview
      v-if="viewState.indexOf('preview') >= 0"
      ref="preview"
      :subject="rawEmailSubjectInput"
      :content="rawInputMd"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import Clipboard from 'clipboard';
import debounce from 'debounce';
import markdown from './markdown-render';
import Preview from './preview/index.vue';
import EditHelper from '../utils/edit-helper';
import MdImage from '../models/Image';
import ThemeService from '../services/theme-service';

  @Component({
    components: {
      Preview,
    },
  })
export default class Markdown extends Vue {
    $refs!: {
      preview: Preview,
      inputTextArea: HTMLTextAreaElement,
      button: HTMLElement,
    };

    public viewState: string[] = ['edit', 'preview'];

    public rawInputMd: string = '';

    public rawEmailSubjectInput: string = '极客MD编辑器\n用Markdown写邮件';

    public editHelper: EditHelper | null = null;

    public imageStorage: MdImage[] = [];

    public showSubjectInput: boolean = true;

    public themeService: ThemeService = new ThemeService();

    private reset() {
      localStorage.removeItem('md.images');
      localStorage.removeItem('md.emailSubjectInput');
      localStorage.removeItem('md.content');
      this.loadDefaultContent();
    }

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
          markdown.imageAdd(`${image.id}`, image.data);
        });
      } else {
        this.imageStorage = [];
      }
      const subject: string | null = localStorage.getItem('md.emailSubjectInput');
      if (subject) {
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
      const copyBtn: HTMLElement = this.$refs.button as HTMLElement;
      const clipboard = new Clipboard(copyBtn, {
        target: () => this.$refs.preview.previewHtmlNode() as HTMLElement,
      });
      clipboard.on('success', Markdown.onCopy);
      clipboard.on('error', Markdown.onError);

      const inputTextArea: HTMLTextAreaElement = this.$refs.inputTextArea as HTMLTextAreaElement;
      inputTextArea.addEventListener('paste', (e: ClipboardEvent) => {
        const { clipboardData } = e;
        if (clipboardData) {
          const { items } = clipboardData;
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
      image.id = `./images/${`${new Date().getTime()}_${this.imageStorage.length}${1}`}.pic`;
      this.imageStorage.push(image);
      markdown.imageAdd(`${image.id}`, image.data);
    }

    private onInputScroll(e: Event) {
      this.showSubjectInput = (e.target as HTMLElement).scrollTop <= 10;
      this.editHelper!.syncElementScrolling(e.srcElement as HTMLElement,
        this.$refs.preview.previewHtmlNode() as HTMLElement);
    }

    static onCopy(e: any) {
      alert('复制成功!');
    }

    static onError(e: any) {
      alert('复制失败');
    }
}
</script>
<style lang='scss'>
  @import "./markdown";
</style>
