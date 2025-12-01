<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { createEventDispatcher, onDestroy, setContext } from 'svelte';
	import { writable, derived } from 'svelte/store';
	import { useA11ySectionContext } from './A11ySection';
	import { stylesHiddenButScreenreadable } from './A11yConsts';
	import { a11yContextKey } from './A11yContext';
	import Html from './Html.svelte';

	export let description: string;
	export let tabIndex: number | undefined = undefined;
	export let debug: boolean = false;
	export let a11yElStyle: Record<string, any> = {};
	export let hidden: boolean = false;
	export let dragThreshold: number | undefined = undefined;
	export let showAltText: boolean = false;

	const { renderer } = useThrelte();
	const domElement = renderer.domElement;
	const dispatch = createEventDispatcher();

	// State
	const meshHover = writable(false);
	const htmlHover = writable(false);
	const focused = writable(false);
	const pressed = writable(false);

	const hovered = derived([meshHover, htmlHover], ([$mesh, $html]) => $mesh || $html);

	const a11yContext = derived([hovered, focused, pressed], ([$hover, $focus, $pressed]) => ({
		hover: $hover,
		focus: $focus,
		pressed: $pressed
	}));

	setContext(a11yContextKey, a11yContext);

	onDestroy(() => {
		if (domElement) domElement.style.cursor = 'default';
	});

	// Mesh Events
	function onMeshOver() {
		meshHover.set(true);
	}
	function onMeshOut() {
		meshHover.set(false);
	}

	// HTML Events
	function handleHtmlOver() {
		htmlHover.set(true);
	}
	function handleHtmlOut() {
		htmlHover.set(false);
	}

	// Styles
	$: commonStyle = {
		...stylesHiddenButScreenreadable,
		opacity: debug ? 1 : 0,
		...a11yElStyle,
		visibility: hidden ? 'hidden' : 'visible'
	};

	function styleObject(node: HTMLElement, obj: Record<string, any>) {
		const update = (newObj: Record<string, any>) => {
			for (const [k, v] of Object.entries(newObj)) node.style.setProperty(k, v);
		};
		update(obj);
		return { update };
	}

	const section = useA11ySectionContext();
	$: portal = section.current instanceof HTMLElement ? section.current : undefined;
	$: altTextVisible = showAltText && $hovered;
</script>

<T.Group
	{...$$restProps}
	on:pointerover={onMeshOver}
	on:pointerout={onMeshOut}
	on:click={(e) => {
		e.stopPropagation();
		if (dragThreshold && e.delta > dragThreshold) return;
		// No activation for image usually
	}}
>
	<slot />

	<Html style="width: 0px" position={$$props.position ?? 0} {portal}>
		{#if altTextVisible}
			<div
				aria-hidden="true"
				style="width: auto; max-width: 300px; display: block; position: absolute; top: 0px; left: 0px; transform: translate(-50%,-50%); background: white; border-radius: 4px; padding: 4px;"
			>
				<p aria-hidden="true" style="margin: 0px;">
					{description}
				</p>
			</div>
		{/if}

		<!-- svelte-ignore a11y-no-noninteractive-element-interactions a11y-no-noninteractive-tabindex -->
		<img
			data-a11y="true"
			src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
			alt={description}
			tabindex={tabIndex}
			use:styleObject={commonStyle}
			on:pointerover|capture={handleHtmlOver}
			on:pointerout|capture={handleHtmlOut}
			on:focus={() => {
				dispatch('focus');
				focused.set(true);
			}}
			on:blur={() => {
				dispatch('blur');
				focused.set(false);
			}}
		/>
	</Html>
</T.Group>
