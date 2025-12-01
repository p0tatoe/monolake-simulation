<script lang="ts">
    import { T, useThrelte } from "@threlte/core";
    import {
        createEventDispatcher,
        onDestroy,
        onMount,
        setContext,
    } from "svelte";
    import { writable } from "svelte/store";
    import announceStore from "./announceStore.js";
    import { useA11ySectionContext } from "./A11ySection.js";
    import { stylesHiddenButScreenreadable } from "./A11yConsts.js";
    import { a11yContextKey } from "./A11yContext.js";
    import Html from "./Html.svelte";

    // Props
    export let role: "button" | "togglebutton" | "link" | "content" | "image" =
        "content";
    export let description: string;
    export let activationMsg: string | undefined = undefined;
    export let deactivationMsg: string | undefined = undefined;
    export let tabIndex: number | undefined = undefined;
    export let href: string | undefined = undefined;
    export let showAltText: boolean = false;
    export let actionCall: (() => any) | undefined = undefined;
    export let focusCall: ((...args: any[]) => any) | undefined = undefined;
    export let disabled: boolean | undefined = undefined;
    export let debug: boolean = false;
    export let a11yElStyle: Record<string, any> | undefined = undefined;
    export let startPressed: boolean = false;
    export let tag: string = "p";
    export let hidden: boolean = false;
    export let dragThreshold: number | undefined = undefined;

    const dispatch = createEventDispatcher();
    const { renderer } = useThrelte();
    const domElement = renderer.domElement;

    // State
    let hovered = false;
    let focused = false;
    let pressed = startPressed;

    // Context
    const a11yContext = writable({
        hover: false,
        focus: false,
        pressed: false,
    });
    setContext(a11yContextKey, a11yContext);

    $: $a11yContext = { hover: hovered, focus: focused, pressed: pressed };

    // Refs
    let overHtml = false;
    let overMesh = false;
    let componentIsMounted = true;

    onDestroy(() => {
        if (domElement) domElement.style.cursor = "default";
        componentIsMounted = false;
    });

    function handleOnPointerOver(e: any) {
        if (e.eventObject) {
            overMesh = true;
        } else {
            overHtml = true;
        }
        if (overHtml || overMesh) {
            if (role !== "content" && role !== "image" && !disabled) {
                domElement.style.cursor = "pointer";
            }
            hovered = true;
        }
    }

    function handleOnPointerOut(e: any) {
        if (e.eventObject) {
            overMesh = false;
        } else {
            overHtml = false;
        }
        if (!overHtml && !overMesh) {
            if (componentIsMounted) {
                domElement.style.cursor = "default";
                hovered = false;
            }
        }
    }

    function handleBtnClick() {
        announceStore.a11yScreenReader("");
        setTimeout(() => {
            if (typeof activationMsg === "string")
                announceStore.a11yScreenReader(activationMsg);
        }, 100);
        if (typeof actionCall === "function") actionCall();
    }

    function handleToggleBtnClick() {
        if (pressed) {
            if (typeof deactivationMsg === "string")
                announceStore.a11yScreenReader(deactivationMsg);
        } else {
            if (typeof activationMsg === "string")
                announceStore.a11yScreenReader(activationMsg);
        }
        pressed = !pressed;
        if (typeof actionCall === "function") actionCall();
    }

    // Styles
    $: constHiddenButScreenreadable = Object.assign(
        {},
        stylesHiddenButScreenreadable,
        { opacity: debug ? 1 : 0 },
        a11yElStyle,
    );

    $: commonStyle = Object.assign(
        {},
        constHiddenButScreenreadable,
        hidden ? { visibility: "hidden" } : { visibility: "visible" },
    );

    // Portal
    const section = useA11ySectionContext();
    $: portal =
        section.current instanceof HTMLElement ? section.current : undefined;

    // Alt Text
    $: altTextVisible = showAltText && hovered;
</script>

<T.Group
    {...$$restProps}
    on:click={(e) => {
        e.stopPropagation();
        if (disabled || (dragThreshold && e.delta > dragThreshold)) {
            return;
        }
        if (role === "button") {
            handleBtnClick();
        } else if (role === "togglebutton") {
            handleToggleBtnClick();
        } else {
            if (typeof actionCall === "function") actionCall();
        }
    }}
    on:pointerover={handleOnPointerOver}
    on:pointerout={handleOnPointerOut}
>
    <slot />

    <Html
        style="width: 0px"
        position={$$props.position ? $$props.position : 0}
        {portal}
    >
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

        {#if role === "button" || role === "togglebutton"}
            <button
                data-r3f-a11y="true"
                {disabled}
                aria-pressed={role === "togglebutton"
                    ? pressed
                        ? "true"
                        : "false"
                    : undefined}
                tabindex={tabIndex ? tabIndex : 0}
                style:cursor={disabled ? "default" : "pointer"}
                style={Object.entries(commonStyle)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(";")}
                on:pointerover={handleOnPointerOver}
                on:pointerout={handleOnPointerOut}
                on:click={(e) => {
                    e.stopPropagation();
                    if (disabled) return;
                    if (role === "togglebutton") handleToggleBtnClick();
                    else handleBtnClick();
                }}
                on:focus={() => {
                    if (typeof focusCall === "function") focusCall();
                    focused = true;
                }}
                on:blur={() => {
                    focused = false;
                }}
            >
                {description}
            </button>
        {:else if role === "link"}
            <a
                data-r3f-a11y="true"
                {href}
                style={Object.entries(commonStyle)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(";")}
                on:pointerover={handleOnPointerOver}
                on:pointerout={handleOnPointerOut}
                on:click={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (typeof actionCall === "function") actionCall();
                }}
                on:focus={() => {
                    if (typeof focusCall === "function") focusCall();
                    focused = true;
                }}
                on:blur={() => {
                    focused = false;
                }}
            >
                {description}
            </a>
        {:else if role === "image"}
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <img
                data-r3f-a11y="true"
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
                alt={description}
                tabindex={tabIndex}
                style={Object.entries(commonStyle)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(";")}
                on:pointerover={handleOnPointerOver}
                on:pointerout={handleOnPointerOut}
                on:focus={() => {
                    if (typeof focusCall === "function") focusCall();
                    focused = true;
                }}
                on:blur={() => {
                    focused = false;
                }}
            />
        {:else}
            <svelte:element
                this={tag}
                data-r3f-a11y="true"
                tabindex={tabIndex}
                style={Object.entries(commonStyle)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(";")}
                on:pointerover={handleOnPointerOver}
                on:pointerout={handleOnPointerOut}
                on:focus={() => {
                    if (typeof focusCall === "function") focusCall();
                    focused = true;
                }}
                on:blur={() => {
                    focused = false;
                }}
            >
                {description}
            </svelte:element>
        {/if}
    </Html>
</T.Group>
