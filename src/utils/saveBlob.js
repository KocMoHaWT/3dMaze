export const  saveBlob = (function () {
  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  return function (blob, fileName) {
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());


/// example

// saveBlob(new Blob([obj]), 'newLabyrinth.obj');
//   OBJExport.ObjAsync(scene, "newLabyrinth").then((obj) => {
//     obj.downloadFiles();
// });
