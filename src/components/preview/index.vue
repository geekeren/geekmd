<template>
  <div class='html-preview-section section'>
    <div class='html-preview-content content'
         ref='parsedHtmlNode'>
      <div class="mail-container">
        <div class='content-container'>
          <div class="content-header">
            <div class="title" v-html="emailSubject() || '<空主题>'">
            </div>
          </div>
          <div class="content-body" v-html='parsedHtml()'>
          </div>
          <div class="content-footer">
          </div>
        </div>
        <div class='copyright-info'>
          本邮件自豪地采用“<a :href="pageUrl">极客MD</a>”编辑并排版
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import markdown from '../markdown-render';

  @Component({
    props: {
      subject: String,
      content: String,
    },
  })
export default class Preview extends Vue {
    pageUrl = window.location.origin;

    previewHtmlNode() {
      return this.$refs.parsedHtmlNode;
    }

    emailSubject() {
      if (this.subject) {
        const titles = this.subject.split('\n');
        return `<div class="sub-title">${titles[0]}</div>${titles[1] || ''}`;
      }
      return '< 空主题 >';
    }

    parsedHtml() {
      if (this.content) {
        const mdToParsed = Preview.parseRawMd(this.content);
        return markdown.render(mdToParsed);
      }
      return '<p style="margin-top: 100px;text-align: center;color: #5e6772">内容为空</p>';
    }

    static parseRawMd(rawMd) {
      return rawMd.replace('\n', '\r\n\n');
    }
  }

</script>

<style scoped>

</style>
