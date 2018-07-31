// *******************************************
// Issue Panel
// *******************************************
function IssuePanel(viewer, container, issue, options) {
  this.viewer = viewer;
  let id = "Issue #" + issue.id
  let title = id
  Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

  // the style of the docking panel
  // use this built-in style to support Themes on Viewer 4+
  this.container.classList.add('docking-panel-container-solid-color-a');
  this.container.style.top = "10px";
  this.container.style.left = "10px";
  this.container.style.width = "auto";
  this.container.style.height = "auto";
  this.container.style.resize = "auto";

  // this is where we should place the content of our panel
  var div = document.createElement('div');
  div.style.margin = '20px';
  div.innerHTML = '<div id="myissue"></div>';
  this.container.appendChild(div);
  // and may also append child elements...
  // get vue component
  console.log(issue)
  new Vue({
    el: '#myissue',
    data: {active_issue:issue},
    methods: {
    },
    template: `
    <section>
      {{active_issue.title}}
    </section>
    `
  })

}
IssuePanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
IssuePanel.prototype.constructor = IssuePanel;

// *******************************************
// My Issue Extension
// *******************************************
function MyIssueExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
  this.panel = null;
}

MyIssueExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MyIssueExtension.prototype.constructor = MyIssueExtension;

MyIssueExtension.prototype.load = function () {
  if (this.viewer.toolbar) {
      // Toolbar is already available, create the UI
      this.createUI();
  } else {
      // Toolbar hasn't been created yet, wait until we get notification of its creation
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
      this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  }
  return true;
};

MyIssueExtension.prototype.onToolbarCreated = function () {
  this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  this.onToolbarCreatedBinded = null;
  this.createUI();
};

MyIssueExtension.prototype.createUI = function () {
  var viewer = this.viewer;
  var panel = this.panel;

  window.addEventListener('onIssueData', e => {
    // if null, create it
    if (panel == null) {
      panel = new IssuePanel(viewer, viewer.container, e.detail)
      panel.setVisible(true)
    } else {
      panel.setVisible(false)
      panel.uninitialize()
      panel = new IssuePanel(viewer, viewer.container, e.detail)
      panel.setVisible(true)
    }
  })

  // button to show the docking panel
  var toolbarButtonShowDockingPanel = new Autodesk.Viewing.UI.Button('showIssuePanel');
  toolbarButtonShowDockingPanel.onClick = function (e) {
      // if null, create it
      if (panel == null) {
          panel = new IssuePanel(viewer, viewer.container, 
              'IssueExtensionPanel', 'My Issue Extension');
      }
      // show/hide docking panel
      panel.setVisible(!panel.isVisible());
  };
  // myIssueToolbarButton CSS class should be defined on your .css file
  // you may include icons, below is a sample class:
  /* 
  .myIssueToolbarButton {
      background-image: url(/img/myIssueIcon.png);
      background-size: 24px;
      background-repeat: no-repeat;
      background-position: center;
  }*/
  toolbarButtonShowDockingPanel.addClass('myIssueToolbarButton');
  toolbarButtonShowDockingPanel.setToolTip('My Issue extension');

  // SubToolbar
  this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('MyIssueAppToolbar');
  this.subToolbar.addControl(toolbarButtonShowDockingPanel);

  viewer.toolbar.addControl(this.subToolbar);
};

MyIssueExtension.prototype.unload = function () {
  this.viewer.toolbar.removeControl(this.subToolbar);
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('MyIssueExtension', MyIssueExtension);