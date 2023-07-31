// const choice = ["kernelk14/slug", "serenityos/jakt"]
const choice1 = "kernelk14/slug serenityos/jakt"
let choice = choice1.split(" ")
let i = 0

console.log("Here is the list of repos you watched: ")
for (; i < choice.length; i++) {
  console.log(` [${i+1}]  > ${choice[i]}`)
}
const pr = prompt("Choose the number of the repo: ")

console.log(choice[pr-1])
console.log(pr)
console.log(choice[0])
