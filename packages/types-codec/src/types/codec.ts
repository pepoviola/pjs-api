// Copyright 2017-2023 @polkadot/types-codec authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HexString } from '@polkadot/util/types';
import type { AnyJson } from './helpers';
import type { IU8a } from './interfaces';
import type { Registry } from './registry';

export type BareOpts = boolean | Record<string, boolean>;

export interface Inspect {
  inner?: Inspect[];
  name?: string;
  outer?: Uint8Array[];
}

interface CodecDeprecated {
  /** @deprecated Use $createdAtHash instead. This getter will be removed in a future version. */
  readonly createdAtHash: IU8a | undefined;

  /** @deprecated Use $encodedLength instead. This getter will be removed in a future version. */
  readonly encodedLength: number;

  /** @deprecated Use $initialU8aLength instead. This getter will be removed in a future version. */
  readonly initialU8aLength: number | undefined;

  /** @deprecated Use $isEmpty instead. This getter will be removed in a future version. */
  readonly isEmpty: boolean;

  /** @deprecated Use $registry instead. This getter will be removed in a future version. */
  readonly registry: Registry;
}

/**
 * @name Codec
 * @description
 * The base Codec interface. All types implement the interface provided here.
 * Additionally implementors can add their own specific interfaces and helpers
 * with getters and functions. The Codec Base is however required for operating
 * as an encoding/decoding layer
 */
export interface Codec extends CodecDeprecated {
  /**
   * @description
   * The block at which this value was retrieved/created (set to non-empty when
   * retrieved from storage)
   */
  $createdAtHash?: IU8a;

  /**
   * @description
   * The length of the value when encoded as a Uint8Array (which is the SCALE representation)
   */
  readonly $encodedLength: number;

  /**
   * @description
   * The length of the initial encoded value (Only available when the value was
   * constructed from a Uint8Array input)
   */
  $initialU8aLength?: number;

  /**
   * @description
   * Checks if the value is an empty value, with the internal bytes all-zero
   */
  $isEmpty: boolean;

  /**
   * @description
   * (internal usage) Indicates that the value was created via a fallback. This
   * is used when with data specified in the metadata when the storage entry is
   * empty.
   *
   * With metadata fallback values (available as defaults on most storage entries)
   * any empty storage item should erturn the default. (This is the same as the
   * implementation on the Substrate runtime)
   */
  $isStorageFallback?: boolean;

  /**
    * @description
    * The type registry associated with this object, as available when this type
    * was initially created.
    */
  readonly $registry: Registry;

  /**
   * @description Returns a hash of the value
   */
  readonly hash: IU8a;

  /**
   * @description Compares the value of the input to see if there is a match
   */
  eq (other?: unknown): boolean;

  /**
   * @description Returns a breakdown of the hex encoding for this Codec
   */
  inspectU8a (isBare?: BareOpts): Inspect;

  /**
   * @description Returns a hex string representation of the value. isLe returns a LE (number-only) representation
   */
  toHex (isLe?: boolean): HexString;

  /**
   * @description Converts the Object to to a human-friendly JSON, with additional fields, expansion and formatting of information
   */
  toHuman (isExtended?: boolean): AnyJson;

  /**
   * @description Converts the Object to JSON, typically used for RPC transfers
   */
  toJSON (): AnyJson;

  /**
   * @description Converts the value in a best-fit primitive form
   */
  toPrimitive (): AnyJson;

  /**
   * @description Returns the base runtime type name for this instance
   */
  toRawType (): string;

  /**
   * @description Returns the string representation of the value
   */
  toString (): string;

  /**
   * @description Encodes the value as a Uint8Array as per the SCALE specifications
   * @param isBare true when the value has none of the type-specific prefixes (internal)
   */
  toU8a (isBare?: BareOpts): Uint8Array;
}

export interface CodecClass<T = Codec> {
  /**
   * @description An internal fallback type (previous generation) if encoding fails
   */
  readonly __fallbackType?: string;

  // NOTE: We need the any[] here, unknown[] does not work as expected
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new(registry: Registry, ...args: any[]): T;
}

export type CodecTo = 'toHex' | 'toJSON' | 'toPrimitive' | 'toString' | 'toU8a';

export type ArgsDef = Record<string, CodecClass | string>;
