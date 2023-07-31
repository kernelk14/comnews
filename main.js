// Import needed stuff
import { Octokit, App } from "https://esm.sh/octokit?dts"
import { exists } from "https://deno.land/std/fs/mod.ts"

// Get the auth file
const auth_file = await Deno.readTextFile("./gh_personal_access.txt")

const octokit = new Octokit ({
  auth: auth_file
})

// Get login 
const {
  data: {login},
} = await octokit.rest.users.getAuthenticated();
console.log(`Hello, ${login}!`)

// Getting the list of repo subs
const subfile = "/home/khyle/.reposub"

try { 
  const parseFile = await Deno.readTextFile(subfile)
  let splitNames = parseFile.split(" ")
  if (splitNames.includes("\n")) {
    // splitNames.replace("\n", " ")
    // plsParse(splitNames)
    splitNames = file.split("\n")
  }
  // console.log(file)
  
  let i = 0
  console.log("Available repo subscriptions: ")
  for (;i < splitNames.length;) {
    console.log(`  [${i+1}] > ${splitNames[i]}`)
    i++
  }
  const input = prompt("> ")
  console.log(splitNames[input-1])
  let keyword = splitNames[input-1]
  let repos = keyword.split("/")
  const printrepo = await octokit.request(`GET /repos/{owner}/{repo}/commits`, {
      owner: repos[0],
      repo: repos[1],
      headers: {
          'X-Github-Api-version': '2022-11-28'
      }
  })
  var data = printrepo['data']
  let j = 0
  console.log("Commit Lists:")
  while (j < data.length) {
      var d1 = data[j]['commit']['message']
      var d2 = data[j]['commit']['committer']['name']
      var d3 = data[j]['commit']['committer']['date']
      console.log(`\nDate: ${d3}\nCommitter: ${d2}\nCommit: ${d1}\n------------------------------------------------------`)
      j++
  }
  console.log("\n\n")
} catch(error) {
  if (!(error instanceof Deno.errors.NotFound)) {
    console.log("You don't have a `.reposub` file in your home directory. Please create one first.")
    throw error 
  }
}
