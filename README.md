# Nova Upload Service (Next)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)

### Installation

Inside the root of the project install the dependencies using bun:

```bash
bun install
```

## Development
To start the development server run:

```bash
bun dev
```

Open http://localhost:3000/ with your browser to see the result.

## Committing convention

Our committing convention is based on [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

**Template:**

```shell
type(scope): description

body
```

**Example:**

```shell
docs(getting-started): Adding some getting started information to docs

this is a body of the commit message
```

To make your life a little easier, commitizen is implemented to help you compose your commits following the standards. Just run `bun commit` to create your commit:

![Commitizen demo](docs/commitizen-demo.gif)

### Best practices

#### Be nitpicky about your commits

Since our work is done in a potential public repository it's important to keep our commits as clean as possible. This means that you should only commit the files that are relevant to the changes you are making. If you are working on a feature, only commit the files that are relevant to that feature. If you are working on a bug, only commit the files that are relevant to that bug. This will make it easier for your colleagues to understand what you are doing and will make it easier to review your code.

The commit messages will be related to the files that are being commited, one repository can have multiple commits with multiple types, splitting up your commits will make it easier to understand and will only be added to the related changelog file of the app or package.

#### Use the correct scope

The scope of your commit should reflect the part of the codebase you are changing. For example, if you are changing the `routes` component for the `identity-api` you should use `identity-api` as the scope. If you are changing a `helper` function in the `upload-api` you should use `upload-api` as the scope.
