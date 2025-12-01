<script lang="ts">
	import { HTML } from '@threlte/extras';

	export let position: any = undefined;
	export let style: any = undefined;
	export let portal: HTMLElement | undefined = undefined;

</script>

<HTML {position} {style} {portal} {...$$restProps}>
	<slot />
</HTML>
