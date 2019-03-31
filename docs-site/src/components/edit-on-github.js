import GithubIcon from "react-icons/lib/go/mark-github"

const EditOnGithub = ({ path }) => (
  <div css={{
    textAlign: 'right',
    width: '100%'
  }}>
    <a
      href={`https://github.com/SqueezerIO/squeezer/edit/master${path}`}
      title="Github"
      css={{
      }}
    >
      <GithubIcon style={{ verticalAlign: `text-top` }} />
      &nbsp;Edit on github
    </a>
  </div>
)

export default EditOnGithub
