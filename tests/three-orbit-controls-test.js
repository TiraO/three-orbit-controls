var expect = require('chai').expect;
var THREE = require('three');
var OrbitControls = require('../index')(THREE);
var JSDOM = require('jsdom').JSDOM;

var window = new JSDOM('<!DOCTYPE html><p>Hello world</p>').window;
global.window = window;
global.document = window.document;
var MouseEvent = window.MouseEvent;

function defineProperty(object, propertyName, propertyValue) {
  Object.defineProperty(object, propertyName, {
    get: function () {
      return propertyValue;
    },
    enumerable: true,
    configurable: true
  });
}

describe("three-orbit-controls", function () {
  describe("after depressing the orbit button", function () {
    var orbitControls, camera, domElement;
    beforeEach(function () {
      domElement = window.document.createElement('div');
      defineProperty(domElement, 'clientWidth', 100);
      defineProperty(domElement, 'clientHeight', 100);
      document.body.appendChild(domElement);

      camera = new THREE.PerspectiveCamera(50, 1000, 1000);
      camera.position.x = -100;
      orbitControls = new OrbitControls(camera, domElement);

      var mouseDown =
        new MouseEvent('mousedown', {
          button: orbitControls.mouseButtons.ORBIT,
          clientX: 50,
          clientY: 50
        });
      domElement.dispatchEvent(mouseDown);
    });

    afterEach(function () {
      document.body.removeChild(domElement);
    });

    describe("moving the mouse downwards", function () {
      var mouseMove;
      beforeEach(function () {
        mouseMove = new MouseEvent('mousemove', {
          clientX: 50,
          clientY: 60
        });
      });

      it("moves the camera upwards", function () {
        document.dispatchEvent(mouseMove);
        expect(camera.position.y).to.be.greaterThan(10);
      });

      describe("when the camera's up is in the z direction", function () {
        beforeEach(function () {
          camera.up.set(0, 0, 1);
          orbitControls = new OrbitControls(camera, domElement);

          var mouseDown =
            new MouseEvent('mousedown', {
              button: orbitControls.mouseButtons.ORBIT,
              clientX: 50,
              clientY: 60
            });
          domElement.dispatchEvent(mouseDown);
        });

        it("moves the camera in the z direction", function () {
          document.dispatchEvent(mouseMove);
          expect(camera.position.z).to.be.greaterThan(10);
        });
      });
    });
  });
});