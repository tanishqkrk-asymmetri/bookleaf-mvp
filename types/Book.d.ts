export interface Book {
  id: string;
  bookName: string;
  editTrace: Edit[];
  lastEdited: number;
  front: Front;
  back: Back;
  spine: Spine;
}

export interface Edit {}
export interface Front {
  backgroundType: "Template" | "Color" | "Image" | "Gradient";
  template: {
    templateId: string;
  };
  color: {
    colorCode: string;
  };
  image: {
    imageUrl: string;
  };
  gradient: {
    from: string;
    to: string;
    direction: number;
  };
  text: {
    font: "Default" | string;
    title: string;
    subtitle: string;
    position: {
      x: number;
      y: number;
    };
  };
}
export interface Back {}
export interface Spine {}
