Inside that directory, you can run several commands:

npx playwright test
Runs the end-to-end tests.

npx playwright test --ui
Starts the interactive UI mode.

npx playwright test --project=chromium
Runs the tests only on Desktop Chrome.

npx playwright test example
Runs the tests in a specific file.

npx playwright test --debug
Runs the tests in debug mode.

npx playwright codegen
Auto generate tests with Codegen.

We suggest that you begin by typing:

    npx playwright test

## other

npx playwright show-report
npx playwright test --workers 3

## running a particular file

npx playwright test .tests/example.spec.ts

## with title of test

npx playwright test -g "has title"

## run on specific browser

npx playwright test --project=chromium -g "has title"

## run tests in headed mode( with GUI)

npx platwright test --headed

## debug a test

npx playwright test --debug --project=chromium

## starting from a certain line

npx playwright test .tests/example.spec.ts:10

## codegen

npx playwright codegen --browser=chromium

## codegen to write the generated tests to a file

npx playwright codegen --target typescript -o tests/test1.spec.ts saucedemo.com

## adding viewport size(screen resolution)

npx playwright codegen --viewport-size 800,600

## emulate device

npx playwright codegen --device="iPhone 12 Pro"

## emulate color scheme, if avaibale in a website

npx playwright codegen --color-scheme=dark

## for help

npx playwright codegen --help
