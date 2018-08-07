
var VueIssue;
var ProjectID;
function loadIssues(project_id) {
  if(VueIssue) {
    VueIssue.$data.project = project_id
  } else {
    VueIssue = new Vue({
      el: '#issues',
      firebase: {
        rawissues: {
          source: db.ref('issues').orderByChild("created_at"),
          asObject: false
        },
        notes: {
          source: db.ref('notes').orderByChild("created_at"),
          asObject: false
        }
      },
      data: {
        project: project_id
      },
      methods: {
        showExportModal () {
          window.dispatchEvent(new CustomEvent('onShowExport', {'detail': this.issues}))
        },
        sendIssue (issue) {
          issue.comments = this.notes.filter(note => note.issue_id === issue.id)
          window.dispatchEvent(new CustomEvent('onIssueData', {'detail': issue}))
          window.dispatchEvent(new Event('onDrawMarkUp'))
        }
      },
      computed: {
        issues () {
          return this.rawissues.filter(i => i.project_id === this.project);
        }
      },
      template: `
        <div class="panel panel-default fill" style="height: 500px">
          <div class="panel-heading">
            <strong>Issues</strong>
            <button type="button" class="btn btn-xs btn-info" style="float: right" id="showNewIssuePanel" @click="window.dispatchEvent(new Event('onNewIssue'))">
              <span class="glyphicon glyphicon-plus"></span>
              <span>New Issue</span>
            </button>
          </div>
          <ul class="list-group list-group-flush">
            <button @click="sendIssue(issue)" type="button" class="list-group-item list-group-item-action" v-for="issue in issues" :key="issue.id" style="padding: 5px 12px">
              {{issue.title}}
              <span style="float: right; position: relative; top: -1px;" :class="{'label': true, 'label-danger':issue.state === 'closed', 'label-success': issue.state === 'open','label-pill':true}">{{issue.state}}</span>
            </button>
          </ul>
          <div style="display: flex; justify-content: center;">
          <button type="button" @click="showExportModal" class="btn btn-xs btn-primary" style="position: absolute; bottom: 35px;">Export Issues</button>
          </div>
        </div>

      `
    })
  }
}

window.addEventListener('onProjectChanged', e => {
  loadIssues(e.detail)
  ProjectID = e.detail
})
