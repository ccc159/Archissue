// *******************************************
// Issue Panel
// *******************************************
function IssuePanel(viewer, container, issue, options) {
  this.viewer = viewer
  this.type = "IssuePanel"
  let id = "Issue #" + issue.id
  let title = id
  Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options)

  // the style of the docking panel
  // use this built-in style to support Themes on Viewer 4+
  this.container.classList.add('docking-panel-container-solid-color-a');
  this.container.style.top = "10px";
  this.container.style.left = "10px";
  this.container.style.width = "350px";
  this.container.style.height = "700px";
  this.container.style.resize = "auto";
  this.container.style.minHeight = "400px";
  this.container.style.minWidth = "350px";

  // this is where we should place the content of our panel
  var div = document.createElement('div');
  div.style.margin = '15px';
  div.innerHTML = '<div id="myissue"></div>';
  this.container.appendChild(div);
  // using vue to cutomize issue content
  VueIssuePanel(issue)

}
IssuePanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
IssuePanel.prototype.constructor = IssuePanel;

// *******************************************
// NewIssue Panel
// *******************************************
function NewIssuePanel(viewer, container, options) {
  this.viewer = viewer;
  let id = "New Issue"
  let title = id
  this.type = "NewIssuePanel"
  Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);

  // the style of the docking panel
  // use this built-in style to support Themes on Viewer 4+
  this.container.classList.add('docking-panel-container-solid-color-a');
  this.container.style.top = "10px";
  this.container.style.left = "10px";
  this.container.style.width = "350px";
  this.container.style.height = "450px";
  this.container.style.resize = "auto";
  this.container.style.minHeight = "450px";
  this.container.style.minWidth = "350px";

  // this is where we should place the content of our panel
  var div = document.createElement('div');
  div.style.margin = '15px';
  div.innerHTML = '<div id="mynewissue"></div>';
  this.container.appendChild(div);
  // and may also append child elements...
  VueNewIssuePanel()

}
NewIssuePanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
NewIssuePanel.prototype.constructor = NewIssuePanel;

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
  this.viewer.addEventListener(av.SELECTION_CHANGED_EVENT, this.onSelectionChanged.bind(this));
  return true;
};

MyIssueExtension.prototype.onToolbarCreated = function () {
  this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
  this.onToolbarCreatedBinded = null;
  this.createUI();
};

MyIssueExtension.prototype.onSelectionChanged = function () {
  this.viewer.setSelectionColor(new THREE.Color(0x0000FF), Autodesk.Viewing.SelectionMode.MIXED);
};

MyIssueExtension.prototype.createUI = function () {
  var viewer = this.viewer;
  var panel = this.panel;

  // swith between different issues
  window.addEventListener('onIssueData', e => {
    // if null, create it
    if ( panel == null || panel.type === "NewIssuePanel") {
      panel = new IssuePanel(viewer, viewer.container, e.detail)
      panel.setVisible(true)
    } else {
      panel.setVisible(false)
      panel.uninitialize()
      panel = new IssuePanel(viewer, viewer.container, e.detail)
      panel.setVisible(true)
    }
    // change camera view
    if (e.detail.camera) {
      viewer.restoreState(e.detail.camera);
    }
    // change selected model
    viewer.clearSelection()
    if (e.detail.related_components) {
      viewer.select(e.detail.related_components);
      viewer.setSelectionColor(new THREE.Color(0xFF0000), Autodesk.Viewing.SelectionMode.MIXED);
    }
  })

  // create a new issue
  window.addEventListener('onNewIssue', () => {
    // if null, create it
    if (panel == null) {
      panel = new NewIssuePanel(viewer, viewer.container)
      panel.setVisible(true)
    } else {
      panel.setVisible(false)
      panel.uninitialize()
      panel = new NewIssuePanel(viewer, viewer.container)
      panel.setVisible(true)
    }
  })

  // close issue panel
  window.addEventListener('closeNewIssuePanel', () => {
    // if null, create it
    if (panel != null) {
      if (panel.type === "NewIssuePanel") {
        panel.setVisible(false)
        panel.uninitialize()
      }
    }
  })

  // button to show the docking panel
  var toolbarButtonShowDockingPanel = new Autodesk.Viewing.UI.Button('Export Issues');
  toolbarButtonShowDockingPanel.onClick = function (e) {
      // if null, create it
      if (panel == null) {
          panel = new IssuePanel(viewer, viewer.container,
              'IssueExtensionPanel', 'My Issue Extension');
      }
      // show/hide docking panel
      panel.setVisible(!panel.isVisible());
  };

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