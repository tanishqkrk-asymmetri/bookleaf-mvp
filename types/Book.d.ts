export interface Book {
  id: string;
  bookName: string;
  ISBN: string;
  pageCount: string;
  splineWidth: string;
  coverData: CoverData;
  frontImageUrl?: string;
  backImageUrl?: string;
  splineImageUrl?: string;
  redirect_url: string;
}

// {
//     id,
//     bookName,
//     ISBN,
//     splineWidth,
//     coverData,
//     frontImageUrl,
//     backImageUrl,
//     splineImageUrl,
//   }

export interface CoverData {
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
    overlayColor: string;
    overlayOpacity: number;
  };
  gradient: {
    from: string;
    to: string;
    direction: number;
  };
  text: {
    font: "Default" | string;
    title: {
      content: string;
      size: number;
      color: string;
      font: string;
      bold: boolean;
      italic: boolean;
      underline: boolean;
      align: "left" | "center" | "right" | "justify";
      lineHeight: number;
      position: {
        x: number;
        y: number;
      };
    };
    subTitle: {
      content: string;
      size: number;
      color: string;
      font: string;
      bold: boolean;
      italic: boolean;
      underline: boolean;
      align: "left" | "center" | "right" | "justify";
      lineHeight: number;
      position: {
        x: number;
        y: number;
      };
    };
    authorName: {
      content: string;
      size: number;
      color: string;
      font: string;
      bold: boolean;
      italic: boolean;
      underline: boolean;
      align: "left" | "center" | "right" | "justify";
      lineHeight: number;
      position: {
        x: number;
        y: number;
      };
    };
  };
}
export interface Back {
  color: {
    colorCode: string;
  };
  description: {
    content: string;
    size: number;
    color: string;
    font: string;
  };
  author: {
    title: string;
    content: string;
    imageUrl: string;
    size: number;
    color: string;
    font: string;
  };
}
export interface Spine {
  color: {
    colorCode: string;
  };
}
