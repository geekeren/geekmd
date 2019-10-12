export default class MdImage {
  public id: string;

  public alt: string;

  public data: string;

  constructor(props: any) {
    this.id = props.id;
    this.alt = props.alt;
    this.data = props.data;
  }
}
