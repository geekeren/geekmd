<template xmlns:v-clipboard="http://www.w3.org/1999/xhtml">
  <div class='markdown-container'>
    <div class='markdown-input-section section'>
            <textarea
                name=""
                class='edit-text-area content'
                v-model='rawInputMd'
                @input='onMdInput'>
            </textarea>
    </div>
    <button ref="button">Copy!</button>
    <div class='html-preview-section section content'
         ref="parsedHtml"
         v-html='parsedHtml'>
    </div>
  </div>
</template>
<script lang='ts'>
  import {Marked, Renderer} from "marked-ts";
  import {Component, Vue} from "vue-property-decorator";
  import {highlightAuto} from "highlight.js";
  import Clipboard from "clipboard";


  Marked.setOptions
    ({
        renderer: new Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: (code) => {
            return highlightAuto(code).value;
        },

    });
    @Component
    export default class Markdown extends Vue {
      public rawInputMd: string = "";
      public parsedHtml: string = "";

      mounted() {
        this.rawInputMd = JSON.parse(localStorage.getItem("md.content"));
        this.updateHtmlPreview();
        const parsedHtmlNode = this.$refs.parsedHtml;
        new Clipboard(this.$refs.button, {
          target: function () {
            return parsedHtmlNode;
          }
        });
      }

      public onMdInput() {
        this.updateHtmlPreview();
        localStorage.setItem("md.content", JSON.stringify(this.rawInputMd));
        }

      protected updateHtmlPreview() {
        this.parsedHtml = Marked.parse(this.rawInputMd);
      }

      protected onCopy(e: any) {
        // alert('You just copied: ' + e)
      }

      protected onError(e: any) {
        // alert('Failed to copy texts')
      }
    }
</script>
<style lang="scss">

  .markdown-container {
    width: 100%;
    flex: 2;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    background: #eee;
    .section {
      text-align: left;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;
      margin: 3px 5px;
      border-radius: 2px;
    }
    .content {
      padding: 14px;
    }
    textarea {
      -webkit-appearance: none;
      -moz-appearance: none;
      background-color: transparent;
      border: none;
      border-radius: .4rem;
      box-shadow: none;
      box-sizing: inherit;
      color: #fff;
      width: 100%;
      height: 100%;
    }
    .markdown-input-section {
      background: #333;
    }
    .html-preview-section {
      background: #fff;
    }
  }

</style>
