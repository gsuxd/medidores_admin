export default function blobToURL(blob: Blob) {
    return new Promise<string | ArrayBuffer | null>((resolve) => {
       const reader = new FileReader();
       reader.readAsDataURL(blob);
       reader.onloadend = function () {
          const base64data = reader.result;
          resolve(base64data);
       };
    });
 }
 