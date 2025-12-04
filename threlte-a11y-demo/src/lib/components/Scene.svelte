<script>
	import { T, useThrelte, useTask } from '@threlte/core';
	import { interactivity, useTexture } from '@threlte/extras';
	import { spring } from 'svelte/motion';
	import { A11yToggle } from '@p0tatoe/threlte-a11y';
	import { A11yLink } from '@p0tatoe/threlte-a11y';
	import { A11yContent } from '@p0tatoe/threlte-a11y';
	import { A11yImage } from '@p0tatoe/threlte-a11y';
	import grebe from '../assets/grebe.jpg';

	const { camera } = useThrelte();

	interactivity({
		compute: (event, state) => {
			// Update the pointer
			state.pointer.update((p) => {
				p.x = (event.clientX / window.innerWidth) * 2 - 1;
				p.y = -(event.clientY / window.innerHeight) * 2 + 1;
				return p;
			});
			// Update the raycaster
			state.raycaster.setFromCamera(state.pointer.current, $camera);
		}
	});

	const map = useTexture(grebe);

	// Springs for animation
	const scaleToggle = spring(1);
	const scaleLink = spring(1);
	const scaleStatic = spring(1);
	const scaleImage = spring(1);

	// Toggle state
	let toggled = false;
</script>

<T.PerspectiveCamera
	makeDefault
	position={[0, 2, 10]}
	oncreate={(ref) => {
		ref.lookAt(0, 0, 0);
	}}
/>

<T.DirectionalLight position={[0, 10, 10]} castShadow />
<T.AmbientLight intensity={0.5} />

<!-- Toggle Button -->
<A11yToggle
	description="Toggle Me"
	activationMsg="Toggled On"
	deactivationMsg="Toggled Off"
	startPressed={toggled}
	on:click={(e) => {
		console.log('Toggle clicked');
		toggled = !toggled;
		console.log('New toggled state:', toggled);
	}}
	on:focus={() => scaleToggle.set(1.2)}
	on:blur={() => scaleToggle.set(1)}
>
	<T.Mesh
		position={[-3, 0, 0]}
		scale={$scaleToggle}
		onpointerenter={() => scaleToggle.set(1.2)}
		onpointerleave={() => scaleToggle.set(1)}
		castShadow
	>
		<T.BoxGeometry args={[1.5, 1.5, 1.5]} />
		<T.MeshStandardMaterial color={toggled ? 'green' : 'red'} />
	</T.Mesh>
</A11yToggle>

<!-- 2. Link -->
<A11yLink
	href="https://www.monolake.org/"
	description="Go to Mono Lake"
	on:click={() => window.open('https://www.monolake.org/', '_blank')}
	on:focus={() => scaleLink.set(1.2)}
	on:blur={() => scaleLink.set(1)}
>
	<T.Mesh
		position={[-1, 0, 0]}
		scale={$scaleLink}
		onpointerenter={() => scaleLink.set(1.2)}
		onpointerleave={() => scaleLink.set(1)}
		castShadow
	>
		<T.BoxGeometry args={[1.5, 1.5, 1.5]} />
		<T.MeshStandardMaterial color="blue" />
	</T.Mesh>
</A11yLink>

<!-- 3. Static Element -->
<A11yContent description="I am just a box" tabIndex={-1}>
	<T.Mesh position={[1, 0, 0]} scale={$scaleStatic} castShadow>
		<T.BoxGeometry args={[1.5, 1.5, 1.5]} />
		<T.MeshStandardMaterial color="gray" />
	</T.Mesh>
</A11yContent>

<!-- 4. Image -->
<A11yImage
	description="A Grebe"
	tabIndex={-1}
	on:focus={() => scaleImage.set(1.2)}
	on:blur={() => scaleImage.set(1)}
>
	<T.Mesh
		position={[3, 0, 0]}
		scale={$scaleImage}
		onpointerenter={() => scaleImage.set(1.2)}
		onpointerleave={() => scaleImage.set(1)}
		castShadow
	>
		<T.PlaneGeometry args={[1.5, 1.5]} />
		{#await map then value}
			<T.MeshStandardMaterial map={value} />
		{:catch}
			<T.MeshStandardMaterial color="red" />
		{/await}
	</T.Mesh>
</A11yImage>
