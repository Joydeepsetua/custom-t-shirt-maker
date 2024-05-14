const selectFileBtn = document.getElementById('selectFileBtn');
const fileInput = document.getElementById('imagePicker');
const designContainer = document.getElementById('design-container');
const canva = document.getElementById('canvas');
var canvas = new fabric.Canvas(canva);


if (designContainer) {
    selectFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageDataUrl = reader.result;
            fabric.Image.fromURL(imageDataUrl, function (img) {
                img.set({
                    left: 10,
                    top: 10,
                    scaleX: 0.2,
                    scaleY: 0.2,
                });
                canvas.add(img);
            });
        });
        reader.readAsDataURL(file);
    });
}

// function allowDrop(ev) {
//     ev.preventDefault();
// }

// function drag(ev) {
//     ev.dataTransfer.setData("text", ev.target.id);
// }

// function drop(ev) {
//     ev.preventDefault();
//     var data = ev.dataTransfer.getData("text");
//     designContainer.appendChild(document.getElementById(data));
// }

$(document).ready(function () {
    $("#image-selector").hide();
    $("#edit-text").hide();
    setText()
    $("#image-upload").click(function () {
        $("#image-selector").show();
        $("#create-your-design").hide();
    });

    $("#design-text").click(function () {
        $("#edit-text").show();
        $("#create-your-design").hide();
    });

    $("#back-image-selector").click(function () {
        $("#image-selector").hide();
        $("#create-your-design").show();
    })
    $("#back-edit-text").click(function () {
        $("#edit-text").hide();
        $("#create-your-design").show();
    })
});


function setText() {
    const toolbarOptions = [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'align': [] }],
        ['clean'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
    ];
    const quill = new Quill('#text-editor', {
        theme: 'snow',
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Typing here...',
        formats: [
            'size', 'bold', 'italic', 'underline', 'strike', 'align', 'clean', 'color', 'background', 'font'
        ],
    });

}