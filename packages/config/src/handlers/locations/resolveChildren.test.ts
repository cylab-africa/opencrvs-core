/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors located at https://github.com/opencrvs/opencrvs-core/blob/master/AUTHORS.
 */
import { UUID } from '@opencrvs/commons'
import { resolveLocationChildren } from './locationTreeSolver'
import * as fixtures from '@opencrvs/commons/fixtures'

describe('resolveLocationChildren', () => {
  test('empty locations', () => {
    const result = resolveLocationChildren('anyUUID' as UUID, [])
    expect(result).toEqual([])
  })

  test('parent with no children', () => {
    const result = resolveLocationChildren('uuid1' as UUID, [
      fixtures.savedLocation({ id: 'uuid1' as UUID, partOf: undefined })
    ])
    expect(result).toEqual([])
  })

  test('single level hierarchy', () => {
    const uuid1 = fixtures.savedLocation({
      id: 'uuid1' as UUID,
      partOf: undefined
    })
    const uuid2 = fixtures.savedLocation({
      id: 'uuid2' as UUID,
      partOf: { reference: 'Location/uuid1' }
    })
    const result = resolveLocationChildren('uuid1' as UUID, [uuid1, uuid2])

    expect(result).toContainEqual(uuid2)
    expect(result).toHaveLength(1)
  })

  test('multi-level hierarchy', () => {
    const uuid1 = fixtures.savedLocation({
      id: 'uuid1' as UUID,
      partOf: undefined
    })
    const uuid2 = fixtures.savedLocation({
      id: 'uuid2' as UUID,
      partOf: { reference: 'Location/uuid1' }
    })
    const uuid3 = fixtures.savedLocation({
      id: 'uuid3' as UUID,
      partOf: { reference: 'Location/uuid2' }
    })

    const result = resolveLocationChildren('uuid1' as UUID, [
      uuid1,
      uuid2,
      uuid3
    ])
    expect(result).toEqual([uuid2, uuid3])
  })
})