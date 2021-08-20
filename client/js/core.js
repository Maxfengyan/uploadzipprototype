var file;
var progress = new Progress();
function getFile(e) {
  console.log(e.files);
  if (e.files && e.files[0]) {
    var name = e.files[0].name;
    file = e.files[0];
    if (name) {
      document.querySelector('.text1').innerHTML =
        '<img src="./img/zip.png" /><div>' + name + '</div>';
      document.querySelector('.upload').style.display = 'block';
    }
  }
}

function startUpload() {
  const formData = new FormData();
  formData.append('file', file);
  progress.clear();
  progress.start();
  bytueAjaxJspPost('/upload', formData, function (e) {
    if (e) {
      progress.end();
      setTimeout(function () {
        progress.hidden(e);
      }, 1000);
    }
  });
}

function enterGitlab() {
  window.location.href = 'git';
}
function bytueAjaxJspPost(_url, obj, success, contentType) {
  var xmlhttp = null;
  if (xmlhttp == null) {
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
  }
  xmlhttp.onreadystatechange = function () {
    if (
      xmlhttp.readyState == 4 &&
      (xmlhttp.status == 200 || xmlhttp.status == 201)
    ) {
      success(this.responseText);
    }
  };
  xmlhttp.onerror = function (err) {
    console.log(err);
  };
  /* xmlhttp.onabort = function () {};
  xmlhttp.onloadstart = function () {};
  xmlhttp.onload = function () {};
  xmlhttp.ontimeout = function () {}; */
  xmlhttp.open('POST', _url, true);
  // xmlhttp.withCredentials = true; //支持跨域发送cookies
  // xmlhttp.setRequestHeader('Content-Type', contentType);
  xmlhttp.send(obj);
}

function Progress() {
  this.interval = 0;
  this.second = 4;
}
Progress.prototype.start = function () {
  document.querySelector('.dialog').style.display = 'block';
  document.querySelector('.success').style.display = 'none';
  document.querySelector('.links').textContent = '';
  document.querySelector('.progress-inner').style.background = '#409eff';
  this.interval = setInterval(() => {
    this.second = this.second + 1;
    document.querySelector('.progress-_innerText').textContent =
      this.second + '%';
    if (this.second >= 99) {
      clearInterval(this.interval);
    }
    document.querySelector('.progress-inner').style.width = this.second + '%';
  }, 100);
};

Progress.prototype.stop = function () {
  clearInterval(this.interval);
};

Progress.prototype.end = function () {
  clearInterval(this.interval);
  document.querySelector('.progress-_innerText').textContent = '100%';
  document.querySelector('.progress-inner').style.width = '100%';
  this.second = 4;
  setTimeout(function () {
    document.querySelector('.progress-inner').style.background = '#67c23a';
  }, 500);
};

Progress.prototype.clear = function () {
  clearInterval(this.interval);
  this.interval = 0;
  this.second = 4;
  document.querySelector('.progress-inner').style.width = '4%';
  document.querySelector('.progress-_innerText').textContent = '0%';
};

Progress.prototype.hidden = function (e) {
  setTimeout(() => {
    document.querySelector('.dialog').style.display = 'none';
    document.querySelector('.success').style.display = 'block';
    document.querySelector('.links').textContent = e;
    document.querySelector('.links').setAttribute('href', e);
    this.clear();
  }, 900);
};
