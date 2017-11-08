export class Monster {
  public id: number;
  public name: string;
  public strenght: number;
  public age: number;
  public type: string;

  constructor(id: number, name: string, strenght: number, age: number, type: string) {
    this.id = id;
    this.name = name;
    this.strenght = strenght;
    this.age = age;
    this.type = type;
  }
}
