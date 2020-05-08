/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Creates a new lazy component for an existing one in an extension.
 */
export interface PWALazyComponentOptionsSchema {
  tsext?: string;
  project?: string;
  name?: string;
  prefix?: string;
  selector?: string;
  module?: string;
  /**
   * The path of the component in extension for generating a lazy component.
   */
  path?: string;
  ci?: boolean;
}