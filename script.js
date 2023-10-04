function compress(con, bol) {
    let pref = [];
    let suff = ["end\n"];
    for (let l of con) {
        if (l.includes("skeleton")) {
            let pi = con.indexOf(l);
            pref = con.slice(0, pi).concat(["skeleton\n"]);
            con = con.slice(pi + 1);
            con.pop();
            break;
        }
    }
    let fc = 0;
    for (let l of con) {
        if (l.includes("time")) {
            fc += 1;
        }
    }
    function parse_frame(con) {
        let frame = [];
        for (let line of con) {
            frame.push(line + "\n");
        }
        return frame;
    }
    let frames = [];
    let current_frame = [];
    for (let line of con) {
        if (line.startsWith("time")) {
            if (current_frame.length > 0) {
                frames.push(current_frame);
                current_frame = [];
            }
        } else {
            current_frame.push(line.trim());
        }
    }
    if (current_frame.length > 0) {
        frames.push(current_frame);
    }
    let parsed_frames = frames.map(parse_frame);
    console.log(`Info: your animation frame count is ${fc}.`);
    console.log("Info: GoldSrc supports a maximum of 512 frames per sequence.");
    if (bol < 2) {
        console.log("Please enter a value of 2 or more.");
        return;
    }
    parsed_frames = parsed_frames.filter((_, index) => index % bol === 0);
    let outf = [];
    for (let fr of parsed_frames) {
        let fp = `time ${parsed_frames.indexOf(fr)}\n`;
        fr.unshift(fp);
        outf = outf.concat(fr);
    }
    let result = "";
    for (let line of pref.concat(outf, suff)) {
        if (line.endsWith("\n")) {
            result += line;
        } else {
            result += line + "\n";
        }
    }
    return result;
}


function downloadFile(content, filename) {
    const blob = new Blob([content], { type: "application/octet-stream" });
    const downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = filename;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


function readlines(string) {
    return string.split(/\r?\n/).map(line => line + '\n');
}


var fileContentData = "";
var fileInput = document.getElementById('fileInput');

function selectFile() {
    fileInput.click();
};
document.getElementById('fileInput').addEventListener('change', function () {
    var file = fileInput.files[0];

    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            fileContentData = e.target.result;
        };
        reader.readAsText(file);
    }
});

function downFile() {
    if (!fileInput.files.length) {
        alert("ERROR: The file was not selected.")
    }else {
        downloadFile(compress(readlines(fileContentData), parseInt(document.getElementById("bol").value)), fileInput.value.replace("C:\\fakepath\\", ""));
    }
};
