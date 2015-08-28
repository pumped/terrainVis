
function Calibrate(map) {
  this.map = map;
  var that = this;

  this.data = new CalibrateData(map);
  this.data.onViewChange(function changeView() {
    that.viewChange();
  });

  $(document).keydown(function(e){
    if (e.keyCode == 67 && !e.ctrlKey) {
      that.toggle();
    };

    that.center = that.data.getCenter();

    //if (that.visible()) {
      switch(e.keyCode) {
        case 37: //left
          that.moveCenter(-50,0);
          break;
        case 38: //up
          that.moveCenter(0,50);
          break;
        case 39: //right
          that.moveCenter(50,0);
          break;
        case 40: //down
          that.moveCenter(0,-50);
          break;
      }
    //}

  });

  $("html").append();

  this._zoomHandle();
  this._rotateHandle();
  this._moveHandle();

  /*12.870000000000001
-3.1498202273024596
16337660.785122314   16337660.785122314
-2182837.9025776614 */
  this.setCenter([16337160.785122314,-2182337.9025776614]);
  this.data.setRotation(-3.1498202273024596);
  this.data.setZoom(12.534);
}

Calibrate.prototype.toggle = function() {
  $("#calibrate").toggle();
}

Calibrate.prototype.visible = function() {
  if ($("#calibrate").is(":visible")) {
    return true;
  }
  return false;
}

Calibrate.prototype.show = function() {
  console.log("Begin Callibration");
  $("#calibrate").show();
};

Calibrate.prototype.hide = function() {
  console.log("Begin Callibration");
  $("#calibrate").hide();
};


Calibrate.prototype._moveHandle = function() {
  var that = this;
  this.center = this.data.getCenter();

  $('#xAdjust').on("mousedown",function(){
    that.center = that.data.getCenter();
  });

  $('#xAdjust').on("input",function(){
    console.log("input");
    //get new rotate value and apply
    var adjustBy = Number($(this).val()*10);
    var newCenter = that.center.slice();
    newCenter[0] += adjustBy;
    that.data.setCenter(newCenter);
  });

  $('#xAdjust').on("change",function(){
      //center handle
      $(this).val(0);

      //set new center
      that.center = that.data.getCenter();
  });

  $('#yAdjust').on("mousedown",function(){
    that.center = that.data.getCenter();
  });

  $('#yAdjust').on("input",function(){
    //get new rotate value and apply
    var adjustBy = Number($(this).val()*10);
    var newCenter = that.center.slice();
    newCenter[1] += adjustBy;
    that.data.setCenter(newCenter);
  });

  $('#yAdjust').on("change",function(){
      //center handle
      $(this).val(0);

      //set new center
      that.center = that.map.getView().getCenter();
  });

}

Calibrate.prototype.moveCenter = function(x,y) {
  var center = this.center;
  var newCenter = center.slice();
  console.log(x);
  newCenter[0] += x;
  newCenter[1] += y;
  this.setCenter(newCenter);
  this.viewChange();
};

Calibrate.prototype.setCenter = function(view) {
  this.map.getView().setCenter(view);
  this.view = view;
};

//update values
Calibrate.prototype.viewChange = function() {
  $('#xValue').val(this.data.getCenter()[0]);
  $('#yValue').val(this.data.getCenter()[1]);
  $('#rotationValue').val(this.data.getRotation());
  $('#zoomValue').val(this.data.getZoom());
}

Calibrate.prototype._rotateHandle = function() {
  var that = this;
  this.rotate = that.data.getRotation();
  this.newRotate = this.rotate;

  //update rotate value when handle is touched
  $('#rotationAdjust').on("mousedown",function(){
    that.rotate = that.data.getRotation();
  });

  //adjust each increment
  $('#rotationAdjust').on("input",function(){
    //get new rotate value and apply
    var adjustBy = Number($(this).val())/500;
    that.newRotate = that.rotate + adjustBy;
    that.data.setRotation(Number(that.newRotate));
  });

  //when handle released
  $('#rotationAdjust').on("change",function(){
      //center handle
      $(this).val(0);
      //save new rotate value
      that.rotate = that.newRotate;
  });
}

Calibrate.prototype._zoomHandle = function() {
  var that = this;
  this.zoom = that.data.getZoom();
  this.newZoom = this.zoom;

  //update zoom when handle is first touched
  $('#zoomAdjust').on("mousedown",function(){
    console.log("zoom updated");
    that.zoom = that.data.getZoom();
  });

  //adjust each increment
  $('#zoomAdjust').on("input",function(){
    //get new zoom value and apply
    var adjustBy = ($(this).val())/500;
    //console.log(adjustBy);
    that.newZoom = that.zoom + adjustBy;
    that.data.setZoom(Number(that.newZoom));
    //console.log("Current: "+that.zoom+", Adjust: "+adjustBy+", New: "+that.newZoom);
  });

  //when handle released
  $('#zoomAdjust').on("change",function(){
      //center handle
      $(this).val(0);
      //save new zoom value
      that.zoom = that.newZoom;
  });
}


CalibrateData = function(map) {
  this.map = map;
  this.zoom = map.getView().getZoom();
  this.rotation = map.getView().getRotation();

  this.viewChangeCallback;
  //setup events

  var that = this;
  map.on("moveend", function(e) {
    var newZoom = e.map.getView().getZoom();
    if (!isNaN(newZoom)) {
      that.zoom = newZoom;
    }
    that.rotation = e.map.getView().getRotation();
    that._viewChange();
    //console.log(e);
  });
}

CalibrateData.prototype.onViewChange = function(callback) {
  this.viewChangeCallback = callback;
}

CalibrateData.prototype._viewChange = function() {
  this.viewChangeCallback.apply();
}

CalibrateData.prototype.setZoom = function(zoom) {
  //console.log(zoom);
  this.zoom = zoom;
  this.map.getView().setZoom(zoom);
  this._viewChange();
};

CalibrateData.prototype.setRotation = function(rotation) {
  this.rotation = rotation;
  this.map.getView().setRotation(rotation);
  this._viewChange();
};

CalibrateData.prototype.setCenter = function(center) {
   this.map.getView().setCenter(center);
   this._viewChange();
};

CalibrateData.prototype.getZoom = function() {
  //console.log(this.zoom);
  return this.zoom;
};

CalibrateData.prototype.getRotation = function() {
  return this.rotation;
};

CalibrateData.prototype.getCenter = function() {
  return this.map.getView().getCenter();
};
