from sqlalchemy import Column, String, Integer, Float,Text,DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.sqltypes import BigInteger
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from sqlalchemy.sql import func
from conf.dao_config import material_table_name
from dao.mysql_server import MysqlServer

Base = declarative_base()


class Recipe(Base):
    """data of user registration
    """
    __tablename__ = material_table_name
    index = Column(BigInteger(), primary_key=True,autoincrement=True)
    title = Column(Text())
    url = Column(Text())
    category = Column(Text())
    author = Column(Text())
    description = Column(Text())
    rating = Column(Text())
    rating_count = Column(Text())
    review_count = Column(Text())
    ingredients = Column(Text())
    directions = Column(Text())
    prep_time = Column(Text())
    cook_time = Column(Text())
    total_time = Column(Text())
    servings = Column(BigInteger())
    yields = Column(Text())
    calories = Column(Float())
    carbohydrates_g = Column(Float())
    sugars_g = Column(Float())
    fat_g = Column(Float())
    saturated_fat_g = Column(Float())
    cholesterol_mg = Column(Float())
    protein_g = Column(Float())
    dietary_fiber_g = Column(Float())
    sodium_mg = Column(Float())
    calories_from_fat = Column(Float())
    calcium_mg = Column(Float())
    iron_mg = Column(Float())
    magnesium_mg = Column(Float())
    potassium_mg = Column(Float())
    zinc_mg = Column(Float())
    phosphorus_mg = Column(Float())
    vitamin_a_iu_IU = Column(Float())
    niacin_equivalents_mg = Column(Float())
    vitamin_b6_mg = Column(Float())
    vitamin_c_mg = Column(Float())
    folate_mcg = Column(Float())
    thiamin_mg = Column(Float())
    riboflavin_mg = Column(Float())
    vitamin_e_iu_IU = Column(Float())
    vitamin_k_mcg = Column(Float())
    biotin_mcg = Column(Float())
    vitamin_b12_mcg = Column(Float())
    mono_fat_g = Column(Float())
    poly_fat_g = Column(Float())
    trans_fatty_acid_g = Column(Float())
    omega_3_fatty_acid_g = Column(Float())
    omega_6_fatty_acid_g = Column(Float())
    instructions_list = Column(Text())
    image = Column(MEDIUMTEXT())
    step_images = Column(MEDIUMTEXT())
    createtime = Column(DateTime(timezone=True), server_default=func.now())


    def __init__(self):
        # Mapping relationship with database
        engine = MysqlServer().get_recipe_detail_engine()
        Base.metadata.create_all(engine)

    def new(
            self,
            title,
            url,
            category,
            author,
            description,
            rating,
            rating_count,
            review_count,
            ingredients,
            directions,
            prep_time,
            cook_time,
            total_time,
            servings,
            yields,
            calories,
            carbohydrates_g,
            sugars_g,
            fat_g,
            saturated_fat_g,
            cholesterol_mg,
            protein_g,
            dietary_fiber_g,
            sodium_mg,
            calories_from_fat,
            calcium_mg,
            iron_mg,
            magnesium_mg,
            potassium_mg,
            zinc_mg,
            phosphorus_mg,
            vitamin_a_iu_IU,
            niacin_equivalents_mg,
            vitamin_b6_mg,
            vitamin_c_mg,
            folate_mcg,
            thiamin_mg,
            riboflavin_mg,
            vitamin_e_iu_IU,
            vitamin_k_mcg,
            biotin_mcg,
            vitamin_b12_mcg,
            mono_fat_g,
            poly_fat_g,
            trans_fatty_acid_g,
            omega_3_fatty_acid_g,
            omega_6_fatty_acid_g,
            instructions_list,
            image,
            step_images
    ):
        self.title = title,
        self.url = url,
        self.category = category,
        self.author = author,
        self.description = description,
        self.rating = rating,
        self.rating_count = rating_count,
        self.review_count = review_count,
        self.ingredients = ingredients,
        self.directions = directions,
        self.prep_time = prep_time,
        self.cook_time = cook_time,
        self.total_time = total_time,
        self.servings = servings,
        self.yields = yields,
        self.calories = calories,
        self.carbohydrates_g = carbohydrates_g,
        self.sugars_g = sugars_g,
        self.fat_g = fat_g,
        self.saturated_fat_g = saturated_fat_g,
        self.cholesterol_mg = cholesterol_mg,
        self.protein_g = protein_g,
        self.dietary_fiber_g = dietary_fiber_g,
        self.sodium_mg = sodium_mg,
        self.calories_from_fat = calories_from_fat,
        self.calcium_mg = calcium_mg,
        self.iron_mg = iron_mg,
        self.magnesium_mg = magnesium_mg,
        self.potassium_mg = potassium_mg,
        self.zinc_mg = zinc_mg,
        self.phosphorus_mg = phosphorus_mg,
        self.vitamin_a_iu_IU = vitamin_a_iu_IU,
        self.niacin_equivalents_mg = niacin_equivalents_mg,
        self.vitamin_b6_mg = vitamin_b6_mg,
        self.vitamin_c_mg = vitamin_c_mg,
        self.folate_mcg = folate_mcg,
        self.thiamin_mg = thiamin_mg,
        self.riboflavin_mg = riboflavin_mg,
        self.vitamin_e_iu_IU = vitamin_e_iu_IU,
        self.vitamin_k_mcg = vitamin_k_mcg,
        self.biotin_mcg = biotin_mcg,
        self.vitamin_b12_mcg = vitamin_b12_mcg,
        self.mono_fat_g = mono_fat_g,
        self.poly_fat_g = poly_fat_g,
        self.trans_fatty_acid_g = trans_fatty_acid_g,
        self.omega_3_fatty_acid_g = omega_3_fatty_acid_g,
        self.omega_6_fatty_acid_g = omega_6_fatty_acid_g,
        self.instructions_list = instructions_list,
        self.image = image
        self.step_images = step_images
