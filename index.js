'use strict';
var subd = require('subdownloader');
var path = require('path');

var resetProgressBar = function (progressBar) {
	progressBar.val(0);
	$('.status').text('');
	$('.snackbar').hide();
	$('.snackbar .snackbar_text').text('');
	$('.close').click(function() {
		$('.snackbar').hide();
	});
};

var srtFileName = function (obj) {
	return path.parse(obj.fileName).name + '.srt';
};

var startDownload = function (filesArray) {
	var progressBar = $('#progressbar');
	var total = 0;
	var downloadedData = 0;
	var perDownloaded = 0;
	subd.on('processing', function (obj) {
		resetProgressBar(progressBar);
		$('.file_name').text(srtFileName(obj));
		$('.status').text('Downloading');
		$('.input_box').hide();
		$('.processing_box').show();
	})
	.on('response', function (obj, res) {
		total = parseInt(res.headers['content-length'], 10);
		console.log(res);
	})
	.on('data', function (obj, chunk) {
		downloadedData += chunk.length;
		perDownloaded = Math.floor(downloadedData * 100 / total);
		$('.progress_value').text(perDownloaded + '%');
		progressBar.val(perDownloaded);
	})
	.on('end', function (obj, res) {
		if (res.statusCode !== '200') {
			$('.status').text('Sorry, no subtitle were found for');
			$('.snackbar').css('background', 'red');
			$('.snackbar .snackbar_text').text('Sorry, no subtitle were found for ' + path.parse(obj.fileName).name);
		} else {
			$('.snackbar').css('background', 'green');
			$('.snackbar .snackbar_text').text(srtFileName(obj) + ' downloaded successfully.');
			$('.status').text('Downloaded');
		}
		$('.snackbar').show();
		$('.input_box').show();
		$('.processing_box').hide();
		console.log('\n');
	});
	subd.subdownload(filesArray);
};

$(document).ready(function () {
    var inputFile = $('#input_file');
    var boxWrapper = $('#box_wrapper');
    var arr = [];
    inputFile.on('change', function (e) {
        var file = $(this).prop('files')[0];
        if(!file.type.match(/video.*/)) {
			alert('Please select video file.');
			return false;
        }
		arr.push(file.path);
        startDownload(arr);
	});
    boxWrapper.on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#box_wrapper').css('border', '4px solid #bfbfb5');
	})
	.on('dragleave', function (e) {
    	e.preventDefault();
    	e.stopPropagation();
    	$('#box_wrapper').css('border', '4px dashed #bfbfb5');
	})
	.on('dragend', function (e) {
        e.preventDefault();
        e.stopPropagation();
	})
	.on('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $('#box_wrapper').css('border', '4px dashed #bfbfb5');
        var file = e.originalEvent.dataTransfer.files[0];
        console.log(file);
        var arr = [file.path];
        startDownload(arr);
	});
});
