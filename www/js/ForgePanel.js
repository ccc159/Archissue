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
  // and may also append child elements...
  // get vue component
  new Vue({
    el: '#myissue',
    data: {active_issue:issue},
    methods: {

    },
    template: `
    <section v-if="Object.keys(active_issue).length > 0">
      <!-- state -->
      <div v-if="active_issue.state === 'open'" style="font-size: 12px;">
        <label class="label label-success label-pill" style="position: relative; top: -1px; margin-right: 3px;">Open</label>
        Opened {{timeago().format(active_issue.created_at)}} by
        <strong>{{active_issue.author}}</strong>
      </div>
      <div v-if="active_issue.state === 'closed'" style="font-size: 12px;">
        <label class="label label-danger label-pill" style="position: relative; top: -1px; margin-right: 3px;">Closed</label>
        Closed {{timeago().format(active_issue.created_at)}} by
        <strong>{{active_issue.author}}</strong>
      </div>
      <hr>
      <!-- title -->
      <h4>{{ active_issue.title }}</h4>
      <!-- description -->
      <p style="font-size: 12px;">{{active_issue.description}}</p>
      <!-- comments -->
      <hr>
      <div style="max-height: 400px; overflow: auto">
        <div v-for="note in active_issue.comments" :key="note.id">
          <comment :note="note"/>
        </div>
      </div>
      <div style="font-size: 12px; position: absolute; bottom: 6px; background: #222;">
        <newcomment :issue="active_issue"/>
      </div>
    </section>
    `
  })

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
  // get vue component
  new Vue({
    el: '#mynewissue',
    data: {
      title: "",
      description: "",
      saveView: false
    },
    methods: {
      submitNewIssue () {
        let id = IssueID()
        // hard coded author and project_id
        let newissue = {
          id: id,
          project_id: 1,
          author: "Chen",
          created_at: new Date().toISOString(),
          description: this.description,
          state: "open",
          title: this.title
        }
        if (this.saveView) {
          let camera = {viewport: viewerApp.myCurrentViewer.viewerState.getState().viewport}
          newissue.camera = camera
        }
        this.SendToDataBase(newissue)
      },
      SendToDataBase (newissue) {
        db.ref('issues/' + newissue.id).set(newissue)
          .then(() => {
            window.dispatchEvent(new Event('closeNewIssuePanel'))
          })
      }
    },
    template: `
    <section>
      <!-- title -->
      <form>
        <div class="form-group">
          <label for="newIssueTitle">Title</label>
          <input v-model="title" type="email" class="form-control form-control-sm" id="newIssueTitle" placeholder="title" style="width: 300px;">
        </div>
        <div class="form-group">
          <label for="newIssueDescription">Description</label>
          <textarea v-model="description" class="form-control" id="newIssueDescription" rows="6" placeholder="write a comment here" style="width: 300px;"></textarea>
        </div>
        <div class="form-group">
          <div class="form-check">
            <input v-model="saveView" class="form-check-input" type="checkbox" id="autoSizingCheck2">
            <label class="form-check-label" for="autoSizingCheck2">
              Save Current View
            </label>
          </div>
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-info btn-sm" @click="submitNewIssue">Submit Issue</button>
        </div>
      </form>
    </section>
    `
  })

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

    if (e.detail.camera) {
      viewer.restoreState(e.detail.camera);
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