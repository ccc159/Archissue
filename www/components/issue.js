function VueIssuePanel(issue) {
  return  new Vue({
    el: '#myissue',
    data: {active_issue:issue},
    methods: {

    },
    template: `
    <section v-if="Object.keys(active_issue).length > 0">
      <!-- state -->
      <div v-if="active_issue.state === 'open'" style="font-size: 12px;">
        <label class="label label-success label-pill" style="position: relative; top: -1px; margin-right: 3px;">Open</label>
        <span v-if="active_issue.updated_at">Re</span>Opened {{timeago().format(active_issue.updated_at ? active_issue.updated_at : active_issue.created_at)}} by
        <strong>{{active_issue.author}}</strong>
      </div>
      <div v-if="active_issue.state === 'closed'" style="font-size: 12px;">
        <label class="label label-danger label-pill" style="position: relative; top: -1px; margin-right: 3px;">Closed</label>
        Closed {{timeago().format(active_issue.updated_at)}} by
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


function VueNewIssuePanel () {
  return new Vue({
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
          author: author_name,
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