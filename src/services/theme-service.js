export default class ThemeService {
    constructor() {
        this.name = 'tech-radar';
        this.repo = `${location.protocol}//${location.hostname}:${location.port}/themes`;
    }
    useRepo(repo) {
        this.repo = repo;
        return this;
    }
    useTheme(themeName) {
        this.name = themeName;
        return this;
    }
    getImageSrc(key) {
        return `${this.path('image')}/${key}`;
    }
    path(relativePath) {
        return `${this.repo}/${relativePath}`;
    }
}
//# sourceMappingURL=theme-service.js.map