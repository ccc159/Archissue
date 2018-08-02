Vue.component('newcomment', {
  data () {
    return {
      isCommenting: false,
      comment_content: ""
    }
  },
  props: ['issue'],
  methods: {
    submitComment () {
      let id = CommentID()
      // hard coded author and project_id
      let comment = {
        id: id,
        issue_id: this.issue.id,
        author: author_name,
        body: this.comment_content,
        created_at: new Date().toISOString()
      }
      this.SendToDataBase(comment)
    },
    SendToDataBase (comment) {
      db.ref('notes/' + comment.id).set(comment).then(() => {
        this.issue.comments.push(comment)
        window.dispatchEvent(new CustomEvent('onIssueData', {'detail': this.issue}))
        this.comment_content = ""
        this.isCommenting = false
      })
    },
    SendIssueToDataBase (newissue) {
      db.ref('issues/' + newissue.id).set(newissue)
        .then(() => {
          window.dispatchEvent(new CustomEvent('onIssueData', {'detail': this.issue}))
        })
    },
    closeIssue () {
      this.issue.state = "closed"
      this.issue.updated_at = new Date().toISOString()
      let newissue = Object.assign({}, this.issue)
      delete newissue[".key"]
      delete newissue["comments"]
      this.SendIssueToDataBase(newissue)
    },
    openIssue () {
      this.issue.state = "open"
      this.issue.updated_at = new Date().toISOString()
      let newissue = Object.assign({}, this.issue)
      delete newissue[".key"]
      delete newissue["comments"]
      this.SendIssueToDataBase(newissue)
    }
  },
  template: `
  <section>
    <div v-if="!isCommenting" style="cursor: text; position: relative; top: -20px; left: 5px;">
      <span v-if="issue.state === 'open'" class="glyphicon glyphicon-plus" style="opacity: 0.6;"></span>
      <span v-if="issue.state === 'open'" style="width: 100%; text-align: center; color: #bdbdbd;" @click="isCommenting=true">Add a comment here.</span>
      <span v-if="issue.state === 'closed'" style="width: 100%; text-align: center; color: #bdbdbd;">Issue is closed.</span>
      <span v-if="issue.state === 'open'" class="text-info" style="float: right; cursor: pointer; padding-left: 100px;" @click="closeIssue">close issue</span>
      <span v-if="issue.state === 'closed'" class="text-info" style="float: right; cursor: pointer; padding-left: 100px;" @click="openIssue">reopen issue</span>
    </div>
    <div v-else>
      <form>
        <div class="form-group">
          <textarea v-model="comment_content" class="form-control" rows="4" placeholder="write a comment here" style="width: 300px;"></textarea>
        </div>
        <div class="form-group">
          <button type="button" class="btn btn-info btn-xs" @click="submitComment">Comment</button>
          <button type="button" class="btn btn-dark btn-xs" @click="isCommenting=false">Cancel</button>
        </div>
      </form>
    </div>
  </section>
  `
})