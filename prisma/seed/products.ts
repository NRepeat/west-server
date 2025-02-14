import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
	console.log("🚀 Заполняем базу тестовыми данными...");

	const productsData = [
		{
			slug: "product-1",
			title: "Product 1",
			variants: [
				{
					color: "Red",
					slug: "variant-1",
					images: [],
					thumbnail: "",
					price: 120.0,
					width: "10cm",
					weight: "500g",
					diameter: "15cm",
					et: "ET45",
					pcd: "5x114.3",
					quantity: 50,
				},
			],
		},
		{
			slug: "product-2",
			title: "Product 2",
			variants: [
				{
					color: "Blue",
					slug: "variant-2",
					images: [],
					thumbnail: "",
					price: 150.0,
					width: "12cm",
					weight: "700g",
					diameter: "18cm",
					et: "ET40",
					pcd: "5x120",
					quantity: 30,
				},
			],
		},
	];

	await prisma.$transaction(async (prisma) => {
		// 🔹 Создаём продукты
		const createdProducts = await prisma.product.createMany({
			data: productsData.map((product) => ({
				uuid: uuidv4(),
				title: product.title,
				slug: product.slug,
			})),
			skipDuplicates: true,
		});

		console.log(`✅ Добавлено ${createdProducts.count} продуктов`);

		// 🔹 Получаем созданные продукты
		const storedProducts = await prisma.product.findMany({
			where: { slug: { in: productsData.map((p) => p.slug) } },
		});

		for (const product of productsData) {
			const storedProduct = storedProducts.find((p) => p.slug === product.slug);
			if (!storedProduct) continue;

			for (const variant of product.variants) {
				const createdVariant = await prisma.productVariant.create({
					data: {
						uuid: uuidv4(),
						color: variant.color,
						images: variant.images,
						thumbnail: variant.thumbnail,
						price: variant.price,
						width: variant.width,
						weight: variant.weight,
						diameter: variant.diameter,
						et: variant.et,
						pcd: variant.pcd,
					},
				});

				// 🔹 Связываем продукт и вариант
				await prisma.productVariantsOnProducts.create({
					data: {
						productId: storedProduct.id,
						productVariantId: createdVariant.id,
					},
				});

				// 🔹 Создаём запись в инвентаре
				await prisma.productInventory.create({
					data: {
						product_variant_id: createdVariant.id,
						quantity: variant.quantity,
					},
				});

				console.log(`📦 Добавлен вариант ${variant.slug} для ${product.slug}`);
			}
		}
	});

	console.log("✅ Данные успешно добавлены!");
}

main()
	.catch((error) => {
		console.error("❌ Ошибка при сидировании:", error);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
