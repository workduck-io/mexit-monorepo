// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      text: string;
      text_light: string;
      background: string;
      light: string;
      dark: string;
    };
  }
}
