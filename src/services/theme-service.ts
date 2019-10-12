export default class ThemeService {
  public name: string = 'tech-radar';

  public repo: string = `${location.protocol}//${location.hostname}:${location.port}/themes`;

  public useRepo(repo: string) {
    this.repo = repo;
    return this;
  }

  public useTheme(themeName: string) {
    this.name = themeName;
    return this;
  }

  public getImageSrc(key: string) {
    return `${this.path('image')}/${key}`;
  }

  private path(relativePath: string) {
    return `${this.repo}/${relativePath}`;
  }
}
