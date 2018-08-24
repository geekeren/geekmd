<template>
    <div class='markdown-container'>
        <div class='markdown-input-section section'>
            <textarea
                    name=""
                    class='edit-text-area content'
                    v-model='rawInputMd'
                    @input='onMdInput'>
            </textarea>
        </div>
        <div class='html-preview-section section content' v-html='parsedHtml'>

        </div>
    </div>
</template>
<script lang='ts'>
    import {Marked, Renderer} from 'marked-ts';
    import {Vue} from 'vue-property-decorator';
    import { debounce } from 'ts-debounce';
    import { highlightAuto } from 'highlight.js';
    import { Component } from 'vue-property-decorator'

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
        public rawInputMd: string = '';
        public parsedHtml: string = '';
        public onMdInput(e: any) {
            this.parsedHtml = Marked.parse(e.target.value);
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
