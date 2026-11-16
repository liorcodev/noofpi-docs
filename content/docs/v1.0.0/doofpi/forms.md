---
title: Forms
description: Validate forms with one Zod schema shared by the browser and the server.
---

# Forms

Define the Zod schema once in a file that both `server/` and `app/` import. Use it as the
endpoint's `input` and as the form's schema. The browser validates before sending, and a 400 from
the server (doofpi's `issues`) is mapped onto the same `errors`.

```ts [shared/schemas.ts]
import { z } from "zod";

export const createUser = z.object({ email: z.string().email() });
```

```ts [server/doofpi.ts]
create: d.endpointBuilder.model({ input: createUser }).write(({ input }) => save(input)),
```

```vue [app/pages/signup.vue]
<script setup lang="ts">
import { createUser } from "../../shared/schemas";

const client = useDoofpi();
const form = useDoofpiForm(createUser, {
  initial: { email: "" },
  onSubmit: (data) => client.create.write(data),
});
</script>

<template>
  <form @submit.prevent="form.submit()">
    <input v-model="form.values.email" />
    <p v-if="form.errors.value.email">{{ form.errors.value.email[0] }}</p>
    <p v-if="form.failure.value">{{ form.failure.value }}</p>
  </form>
</template>
```

## Return Value

| Property                 | Description                                                              |
| ------------------------ | ------------------------------------------------------------------------ |
| `values`                 | Reactive form values                                                     |
| `errors`                 | Keyed by dotted path (`"user.email"`, `"tags.0"`)                        |
| `failure`                | Message of non-validation errors (network, 5xx)                          |
| `submitting`             | `true` while `onSubmit` runs                                             |
| `submit()`               | Validate, then call `onSubmit`                                           |
| `validate()`, `reset()`  | Validate on demand, restore `initial`                                    |

Issues about the whole value use `FORM_ERROR_KEY` (the empty string).

## Helpers

`validate`, `issuesToErrors` and `errorsFromFailure` are exported from `noofpi/runtime` and
`noofpi/server`. Use them for custom forms or to map errors in `d.onError`.
