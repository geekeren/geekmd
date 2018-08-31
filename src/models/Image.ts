export default class MdImage {
  public id: string;
  public name: string;
  public data: string;
  constructor(props: any) {
    this.id = props.id;
    this.name = props.name;
    this.data = props.data;
  }
}
