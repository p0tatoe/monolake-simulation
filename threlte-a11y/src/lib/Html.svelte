<script lang="ts">
  import { HTML } from '@threlte/extras';
  
  export let position: any = undefined;
  export let style: any = undefined;
  export let portal: HTMLElement | undefined = undefined;
  
  // Threlte's HTML component props might differ slightly from R3F's Html.
  // We map what we can.
</script>

<HTML {position} {style} {portal} {...$$restProps}>
  <slot />
</HTML>
