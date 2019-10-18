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
<script>
import { Component, Vue } from 'vue-property-decorator';
import Clipboard from 'clipboard';
import debounce from 'debounce';
import markdown from './markdown-render';
import Preview from './preview';
import EditHelper from '@/utils/edit-helper';
import MdImage from '@/models/Image';
import ThemeService from '@/services/theme-service';

  @Component({
    components: {
      Preview,
    },
  })
export default class Markdown extends Vue {
    viewState = ['edit', 'preview'];

    rawInputMd = '';

    rawEmailSubjectInput = '极客MD编辑器\n用Markdown写邮件';

    editHelper = null;

    imageStorage = [];

    showSubjectInput = true;

    themeService = new ThemeService();

    reset() {
      localStorage.removeItem('md.images');
      localStorage.removeItem('md.emailSubjectInput');
      localStorage.removeItem('md.content');
      this.loadDefaultContent();
    }

    mounted() {
      this.editHelper = new EditHelper(this.$refs.inputTextArea);
      this.loadDefaultContent();
      this.registerEvents();
    }

    loadDefaultContent() {
      try {
        this.imageStorage = JSON.parse(localStorage.getItem('md.images') || '[]');
      } catch (e) {
        this.imageStorage = [];
      }
      if (this.imageStorage && this.imageStorage.constructor === Array
        && this.imageStorage.length > 0) {
        this.imageStorage.forEach((image) => {
          markdown.image_add(`${image.id}`, image.data);
        });
      } else {
        this.imageStorage = [];
      }
      const subject = localStorage.getItem('md.emailSubjectInput');
      if (subject) {
        this.rawEmailSubjectInput = subject;
      }
      const content = localStorage.getItem('md.content');
      if (!content) {
        this.$http.get('/data/example.md')
          .then((data) => {
            this.rawInputMd = data.body;
          });
      } else {
        this.rawInputMd = content;
      }
    }

    registerEvents() {
      const md = this;
      this.$watch('rawEmailSubjectInput', (newValue) => {
        debounce(() => localStorage.setItem('md.emailSubjectInput', newValue), 500)();
      });
      this.$watch('rawInputMd', (newValue) => {
        if (!newValue) {
          md.imageStorage = [];
        }
        debounce(() => localStorage.setItem('md.content', newValue), 1000)();
      });
      this.$watch('imageStorage', (newValue) => {
        debounce(() => localStorage.setItem('md.images', JSON.stringify(newValue)), 1000)();
      });
      const copyBtn = this.$refs.button;
      const clipboard = new Clipboard(copyBtn, {
        target: () => this.$refs.preview.previewHtmlNode(),
      });
      clipboard.on('success', Markdown.onCopy);
      clipboard.on('error', Markdown.onError);

      const { inputTextArea } = this.$refs;
      inputTextArea.addEventListener('paste', (e) => {
        const { clipboardData } = e;
        if (clipboardData) {
          const { items } = clipboardData;
          if (!items) {
            return;
          }
          const types = clipboardData.types || [];
          let item = null;
          for (let i = 0; i < types.length; i += 1) {
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
                const result = imageReader.result.toString() || '';
                const image = new MdImage({
                  id: 0,
                  alt: '图片描述',
                  data: result,
                });
                this.addImage(image);
                this.editHelper.insertTextAtCursor(`\n![${image.alt}](${image.id})\n\n` || '')
                  .then((output) => {
                    this.rawInputMd = output;
                  });
              }
            };
            if (oFile) {
              imageReader.readAsDataURL(oFile);
            }
          }
        }
      });
    }

    addImage(image) {
      image.id(`./images/${`${new Date().getTime()}_${this.imageStorage.length}${1}`}.pic`);
      this.imageStorage.push(image);
      markdown.image_add(`${image.id}`, image.data);
    }

    onInputScroll(e) {
      if (!this.$refs.preview) return;
      this.showSubjectInput = (e.target).scrollTop <= 10;
      EditHelper.syncElementScrolling(e.srcElement,
        this.$refs.preview.previewHtmlNode());
    }

    static onCopy() {
      alert('复制成功!');
    }

    static onError() {
      alert('复制失败');
    }
  }
</script>
<style lang='scss'>
  @import "./markdown";
</style>
