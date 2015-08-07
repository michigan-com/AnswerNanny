import computeAnswer from './index';

export default function run(args) {
  if (args.length === 0) {
    console.log("Usage: deepthought \"some question\"");
    process.exit(10);
  }
  computeAnswer(args[0]).then((response) => {
    if (response.answer) {
      process.stdout.write(response.answer + "\n");
      process.exit(0);
    } else {
      process.stderr.write("No answer.\n");
      process.exit(1);
    }
  }).catch((err) => {
    console.error(err);
      process.exit(9);
  });
}
