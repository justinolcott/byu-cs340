import { Buffer } from "buffer";
import { AuthenticationPresenter, LoginView } from "./AuthenticationPresenter";

export interface RegisterView extends LoginView {
    setImageUrl: (url: string) => void;
    setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  constructor(view: RegisterView) {
    super(view);
  }

  public async doRegister(firstName: string, lastName: string, alias: string, password: string, userImageBytes: Uint8Array): Promise<void> {
    this.doAuthentication(
      () => this.service.register(firstName, lastName, alias, password, userImageBytes),
      () => this.view.navigate("/")
    );
  };

  public getAuthenticationDescription(): string {
    return "register user";
  }

  public handleImageFile(file: File | undefined): void {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };
}