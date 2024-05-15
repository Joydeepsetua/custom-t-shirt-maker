const selectFileBtn = document.getElementById('selectFileBtn');
const fileInput = document.getElementById('imagePicker');
const designContainer = document.getElementById('design-container');
const canva = document.getElementById('canvas');
var canvas = new fabric.Canvas(canva);
var textbox = new fabric.Textbox("", { top: 10, left: 10, fontSize: 14 });


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

    $("#image-upload").click(function () {
        $("#image-selector").show();
        $("#create-your-design").hide();
    });

    $("#design-text").click(function () {
        canvas.add(textbox);
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

const toolbarOptions = [
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'font': ['serif', 'monospace'] }],
    ['bold', 'italic'],
    [{ 'align': [] }],
    ['clean'],
    [{ 'color': [] }, { 'background': [] }],
];
const quill = new Quill('#text-editor', {
    theme: 'snow',
    modules: {
        toolbar: toolbarOptions
    },
    placeholder: 'Typing here...',
    formats: [
        'size', 'font', 'bold', 'italic', 'align', 'color', 'background',
    ],
});
quill.root.style.maxHeight = '100px';
quill.root.innerHTML = '<p>Add text</p>';

quill.on('text-change', function (delta, oldDelta, source) {
    const text = quill.getContents();
    textbox.set('text', text.ops[0].insert);

    var attributes1 = text?.ops[0]?.attributes || {};
    var attributes2 = text?.ops[1]?.attributes || {};
    console.log('1', attributes1);
    console.log('2', attributes2);

    if (attributes1.hasOwnProperty('size')) {
        if (attributes1.size === 'small') {
            textbox.set('fontSize', 10);
        } else if (attributes1.size === 'large') {
            textbox.set('fontSize', 20);
        } else if (attributes1.size === 'huge') {
            textbox.set('fontSize', 30);
        } else {
            textbox.set('fontSize', 14);
        }
    } else {
        textbox.set('fontSize', 14);
    }

    if (attributes1.hasOwnProperty('bold') || attributes1.bold) {
        textbox.set('fontWeight', 'bold');
    } else {
        textbox.set('fontWeight', 'normal');
    }
    if (attributes1.hasOwnProperty('italic') || attributes1.italic) {
        textbox.set('fontStyle', 'italic');
    } else {
        textbox.set('fontStyle', 'normal');
    }
    // if (attributes1.hasOwnProperty('underline') || attributes1.underline) {
    //     textbox.set('textDecoration', 'underline');
    // }
    // if (attributes1.hasOwnProperty('strike') || attributes1.strike) {
    //     textbox.set('textDecoration', 'line-through');
    // }
    if (attributes1.hasOwnProperty('color')) {
        textbox.set('fill', attributes1.color);
    }
    if (attributes1.hasOwnProperty('background')) {
        textbox.set('backgroundColor', attributes1.background);
    }
    if (attributes1.hasOwnProperty('font')) {
        console.log(attributes1.font);
        textbox.set('fontFamily', attributes1.font);
    } else {
        textbox.set('fontFamily', 'serif');
    }
    if (attributes2.hasOwnProperty('align')) {
        textbox.set('textAlign', attributes2.align);
    }

    canvas.renderAll();
});
// quill.on('selection-change', (range, oldRange, source) => {
//     if (range) {
//       if (range.length == 0) {
//         console.log('User cursor is on', range.index);
//       } else {
//         const text = quill.getText(range.index, range.length);
//         console.log('User has highlighted', text);
//       }
//     } else {
//       console.log('Cursor not in the editor');
//     }
//   });