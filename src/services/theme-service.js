export default class ThemeService {
  name = 'tech-radar';

  repo = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/themes`;

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
