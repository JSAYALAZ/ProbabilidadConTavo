export class Muestra {
  public values: Map<string, any> = new Map();
  constructor() {}

  public addAtribute(key: string, value: any) {
    this.values.set(key, value);
  }
  public setAtributes(att: Map<string, any>) {
    this.values = att;
  }
  public includeValue(key: string, value: any) {
    return this.values.get(key)===value
  }
  public getValues(){
    return this.values
  }
}
