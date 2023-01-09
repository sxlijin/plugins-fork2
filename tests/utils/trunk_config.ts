import * as fs from "fs";
import path from "path";
import { ARGS, REPO_ROOT } from "tests/utils";
import YAML from "yaml";

/**
 * Read and parse a YAML file. Throws on failure.
 * @param filePath Absolute path
 */
export const parseYaml = (filePath: string): any => {
  const yamlContents = fs.readFileSync(filePath, "utf8");
  return YAML.parse(yamlContents);
};

/**
 * Return the yaml result of parsing the .trunk/trunk.yaml in a specified repo root.
 */
export const getTrunkConfig = (repoRoot: string): any => {
  const trunkYamlPath = path.resolve(repoRoot ?? "", ".trunk/trunk.yaml");
  return parseYaml(trunkYamlPath);
};

/**
 * Retrieve the desired trunk version for tests. Prefer the environment variable-specified version,
 * then the cli version in the .trunk/trunk.yaml of the repository root.
 */
export const getTrunkVersion = (): string => {
  // trunk-ignore(eslint/@typescript-eslint/no-unsafe-member-access)
  const repoCliVersion = getTrunkConfig(REPO_ROOT).cli.version as string;
  return ARGS.cliVersion ?? repoCliVersion ?? "1.2.1";
};

/**
 * Generate contents for a newly generated, empty trunk.yaml.
 */
export const newTrunkYamlContents = (): string => `version: 0.1
cli:
  version: ${getTrunkVersion()}
downloads:
  - name: jdk-17
    downloads:
      - os:
          linux: linux
          macos: macosx
        cpu:
          x86_64: x64
          arm_64: aarch64
        url: https://cdn.azul.com/zulu/bin/zulu17.38.21-ca-jdk17.0.5-\${os}_\${cpu}.tar.gz
        strip_components: 1

  - name: jdk-11
    downloads:
      - os:
          linux: linux
          macos: macosx
        cpu:
          x86_64: x64
          arm_64: aarch64
        url: https://cdn.azul.com/zulu/bin/zulu11.60.19-ca-jdk11.0.17-\${os}_\${cpu}.tar.gz
        strip_components: 1
runtimes:
  definitions:
    - type: java
      download: jdk-11
  enabled:
    - java@foo

plugins:
  sources:
  - id: trunk
    local: ${REPO_ROOT}
  `;
